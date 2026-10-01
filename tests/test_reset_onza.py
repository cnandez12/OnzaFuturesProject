import unittest
from unittest.mock import MagicMock

from reset_onza_data import reset_database


class ResetOnzaTests(unittest.TestCase):
    def test_refuses_without_stopped_workers(self):
        conn = MagicMock()
        with self.assertRaises(RuntimeError):
            reset_database(conn)
        conn.cursor.assert_not_called()

    def test_refuses_other_project_without_deleting_anything(self):
        conn = MagicMock()
        cur = conn.cursor.return_value.__enter__.return_value
        cur.fetchall.return_value = [("other-project",)]
        with self.assertRaises(RuntimeError):
            reset_database(conn, workers_stopped=True)
        self.assertFalse(any("TRUNCATE" in str(call) for call in cur.execute.call_args_list))

    def test_refuses_unexpected_tables(self):
        conn = MagicMock()
        cur = conn.cursor.return_value.__enter__.return_value
        cur.fetchall.side_effect = [[("onza-futures",)], [("unrelated_data",)]]
        with self.assertRaises(RuntimeError):
            reset_database(conn, workers_stopped=True)
        self.assertFalse(any("TRUNCATE" in str(call) for call in cur.execute.call_args_list))
