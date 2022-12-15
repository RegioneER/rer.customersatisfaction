# -*- coding: utf-8 -*-
from rer.customersatisfaction.testing import (
    RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING,  # noqa: E501,
)
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import SITE_OWNER_NAME
from plone.app.testing import SITE_OWNER_PASSWORD
from plone.app.testing import TEST_USER_ID
from plone.restapi.testing import RelativeSession
from souper.soup import get_soup
from souper.soup import Record
from zope.component import getUtility
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore

import transaction
import unittest


class TestCustomerSatisfactionGet(unittest.TestCase):

    layer = RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING

    def add_record(self, vote, date, uid="", title="", comment=""):
        soup = get_soup("customer_satisfaction_soup", self.portal)
        transaction.commit()
        record = Record()
        record.attrs["vote"] = 1
        record.attrs["date"] = date

        if comment:
            record.attrs["comment"] = comment
        if uid:
            record.attrs["uid"] = uid
        if title:
            record.attrs["title"] = title
        soup.add(record)
        transaction.commit()

    def setUp(self):
        self.app = self.layer["app"]
        self.portal = self.layer["portal"]
        self.portal_url = self.portal.absolute_url()
        self.url = "{}/@customer-satisfaction".format(self.portal_url)
        setRoles(self.portal, TEST_USER_ID, ["Manager"])

        self.document1 = api.content.create(
            title="document 1", container=self.portal, type="Document"
        )
        self.document2 = api.content.create(
            title="document 1", container=self.portal, type="Document"
        )
        transaction.commit()

        # add some reviews
        tool = getUtility(ICustomerSatisfactionStore)
        tool.add(
            {
                "vote": "ok",
                "uid": self.document1.UID(),
                "title": self.document1.title,
            }
        )
        tool.add(
            {
                "vote": "ok",
                "uid": self.document1.UID(),
                "title": self.document1.title,
            }
        )
        tool.add(
            {
                "vote": "ok",
                "uid": self.document2.UID(),
                "title": self.document2.title,
            }
        )

        self.api_session = RelativeSession(self.portal_url)
        self.api_session.headers.update({"Accept": "application/json"})
        self.api_session.auth = (SITE_OWNER_NAME, SITE_OWNER_PASSWORD)

        transaction.commit()

    def tearDown(self):
        self.api_session.close()
        soup = get_soup("customer_satisfaction_soup", self.portal)
        soup.clear()

    def test_deleting_a_content_does_not_remove_entries(self):

        response = self.api_session.get(self.url)
        res = response.json()
        self.assertEqual(res["items_total"], 2)

        api.content.delete(obj=self.document1)
        transaction.commit()

        response = self.api_session.get(self.url)
        res = response.json()
        self.assertEqual(res["items_total"], 2)
