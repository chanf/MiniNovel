import json
import subprocess
import sys
from unittest.mock import Mock

import pytest

from scripts import local_deploy


@pytest.fixture
def deployment(tmp_path, monkeypatch):
    monkeypatch.setattr(local_deploy, "STATE_DIR", tmp_path)
    monkeypatch.setattr(local_deploy, "STATE_FILE", tmp_path / "process.json")
    monkeypatch.setattr(local_deploy, "LOG_FILE", tmp_path / "server.log")
    return tmp_path


def test_stale_pid_does_not_stop_another_process(deployment, monkeypatch):
    local_deploy.STATE_FILE.write_text(json.dumps({"pid": 1234, "token": "old", "port": 5173}))
    monkeypatch.setattr(local_deploy.subprocess, "run", lambda *a, **kw: Mock(stdout="python unrelated-service.py"))
    kill = Mock()
    monkeypatch.setattr(local_deploy.os, "kill", kill)
    local_deploy.stop()
    kill.assert_not_called()
    assert not local_deploy.STATE_FILE.exists()


def test_process_identity_requires_matching_token(deployment, monkeypatch):
    state = {"pid": 1234, "token": "abc"}
    monkeypatch.setattr(local_deploy.subprocess, "run", lambda *a, **kw: Mock(stdout=f"python {local_deploy.ROOT / 'run.py'} --deployment-id different"))
    assert not local_deploy.owned_process(state)
    monkeypatch.setattr(local_deploy.subprocess, "run", lambda *a, **kw: Mock(stdout=f"python {local_deploy.ROOT / 'run.py'} --deployment-id abc"))
    assert local_deploy.owned_process(state)


def test_start_writes_state_and_passes_data_directory(deployment, monkeypatch):
    process = Mock(pid=4567)
    process.poll.return_value = None
    launch = Mock(return_value=process)
    monkeypatch.setattr(local_deploy.subprocess, "Popen", launch)
    monkeypatch.setattr(local_deploy, "healthy", lambda port: True)
    socket = Mock()
    socket.__enter__ = Mock(return_value=socket)
    socket.__exit__ = Mock(return_value=False)
    monkeypatch.setattr(local_deploy.socket, "socket", lambda: socket)
    local_deploy.start(5179, deployment / "data")
    state = json.loads(local_deploy.STATE_FILE.read_text())
    assert state["pid"] == 4567
    assert state["port"] == 5179
    assert state["token"] in launch.call_args.args[0]
    assert launch.call_args.kwargs["env"]["MININOVEL_DATA_DIR"] == str(deployment / "data")
    assert launch.call_args.kwargs["start_new_session"] is True


def test_busy_port_does_not_launch_or_stop_process(deployment, monkeypatch):
    socket = Mock()
    socket.__enter__ = Mock(return_value=socket)
    socket.__exit__ = Mock(return_value=False)
    socket.bind.side_effect = OSError("occupied")
    monkeypatch.setattr(local_deploy.socket, "socket", lambda: socket)
    launch = Mock()
    kill = Mock()
    monkeypatch.setattr(local_deploy.subprocess, "Popen", launch)
    monkeypatch.setattr(local_deploy.os, "kill", kill)
    with pytest.raises(RuntimeError, match="occupied"):
        local_deploy.start(5179, deployment / "data")
    launch.assert_not_called()
    kill.assert_not_called()


def test_launcher_validates_port_without_starting_server():
    result = subprocess.run([sys.executable, "run.py", "--port", "0"], capture_output=True, text=True)
    assert result.returncode == 2
    assert "between 1 and 65535" in result.stderr
