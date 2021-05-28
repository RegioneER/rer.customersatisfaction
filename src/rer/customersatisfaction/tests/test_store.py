# -*- coding: utf-8 -*-
from rer.customersatisfaction.testing import (
    RER_CUSTOMERSATISFACTION_FUNCTIONAL_TESTING,
)
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from zope.component import getUtility
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore

import transaction
import unittest


class TestTool(unittest.TestCase):

    layer = RER_CUSTOMERSATISFACTION_FUNCTIONAL_TESTING

    def setUp(self):
        self.app = self.layer["app"]
        self.portal = self.layer["portal"]
        setRoles(self.portal, TEST_USER_ID, ["Manager"])

    def tearDown(self):
        tool = getUtility(ICustomerSatisfactionStore)
        tool.clear()
        transaction.commit()

    def test_correctly_add_data(self):
        tool = getUtility(ICustomerSatisfactionStore)
        self.assertEqual(len(tool.search()), 0)
        tool.add({"vote": 1})
        self.assertEqual(len(tool.search()), 1)

    def test_only_store_defined_fields(self):
        tool = getUtility(ICustomerSatisfactionStore)
        self.assertEqual(len(tool.search()), 0)
        id = tool.add(
            {
                "vote": 1,
                "foo": "foo",
                "unknown": "mistery",
                "title": "title",
                "comment": "comment",
            }
        )
        self.assertEqual(len(tool.search()), 1)

        item = tool.get_record(id)
        self.assertEqual(item.attrs.get("unknown", None), None)
        self.assertEqual(item.attrs.get("foo", None), None)
        self.assertEqual(item.attrs.get("vote", None), 1)
        self.assertEqual(item.attrs.get("title", None), "title")
        self.assertEqual(item.attrs.get("comment", None), "comment")

    def test_update_record(self):
        tool = getUtility(ICustomerSatisfactionStore)
        id = tool.add({"vote": 1, "comment": "is ok"})

        item = tool.get_record(id)
        self.assertEqual(item.attrs.get("vote", None), 1)
        self.assertEqual(item.attrs.get("comment", None), "is ok")

        tool.update(id=id, data={"vote": -1, "comment": "not ok"})
        item = tool.get_record(id)
        self.assertEqual(item.attrs.get("vote", None), -1)
        self.assertEqual(item.attrs.get("comment", None), "not ok")

    def test_update_record_return_error_if_id_not_found(self):
        tool = getUtility(ICustomerSatisfactionStore)
        res = tool.update(id=1222, data={})
        self.assertEqual(res, {"error": "NotFound"})

    def test_delete_record(self):
        tool = getUtility(ICustomerSatisfactionStore)
        foo = tool.add({"vote": 1, "comment": "is ok", "uid": 1234})
        tool.add({"vote": 1, "comment": "is ok", "uid": 5678})

        self.assertEqual(len(tool.search()), 2)
        tool.delete(id=foo)
        self.assertEqual(len(tool.search()), 1)

    def test_delete_record_return_error_if_id_not_found(self):
        tool = getUtility(ICustomerSatisfactionStore)
        res = tool.delete(id=1222)
        self.assertEqual(res, {"error": "NotFound"})

    def test_clear(self):
        tool = getUtility(ICustomerSatisfactionStore)
        tool.add({"vote": 1, "comment": "is ok", "uid": 1234})
        tool.add({"vote": 1, "comment": "is ok", "uid": 5678})
        transaction.commit()

        self.assertEqual(len(tool.search()), 2)

        tool.clear()
        self.assertEqual(len(tool.search()), 0)
