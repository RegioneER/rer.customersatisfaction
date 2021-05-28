# -*- coding: utf-8 -*-
from datetime import datetime
from rer.customersatisfaction.testing import (
    RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING,  # noqa: E501,
)
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import SITE_OWNER_NAME
from plone.app.testing import SITE_OWNER_PASSWORD
from plone.app.testing import TEST_USER_ID
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.testing import RelativeSession
from souper.soup import get_soup
from souper.soup import Record

import transaction
import unittest


class TestCustomerSatisfactionGet(unittest.TestCase):

    layer = RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING

    def setUp(self):
        self.app = self.layer["app"]
        self.portal = self.layer["portal"]
        self.portal_url = self.portal.absolute_url()
        setRoles(self.portal, TEST_USER_ID, ["Manager"])

        api.user.create(
            email="memberuser@example.com",
            username="memberuser",
            password="secret",
        )

        self.api_session = RelativeSession(self.portal_url)
        self.api_session.headers.update({"Accept": "application/json"})
        self.api_session.auth = (SITE_OWNER_NAME, SITE_OWNER_PASSWORD)
        self.anon_api_session = RelativeSession(self.portal_url)
        self.anon_api_session.headers.update({"Accept": "application/json"})

        transaction.commit()

    def tearDown(self):
        self.api_session.close()
        self.anon_api_session.close()

    def test_anon_cant_get_data(self):
        url = "{}/@customer-satisfaction".format(self.portal_url)
        self.assertEqual(self.anon_api_session.get(url).status_code, 401)

    def test_admin_can_get_data(self):
        url = "{}/@customer-satisfaction".format(self.portal_url)
        self.assertEqual(self.api_session.get(url).status_code, 200)

    def test_other_users_cant_get_data(self):
        api_session = RelativeSession(self.portal_url)
        api_session.headers.update({"Accept": "application/json"})
        api_session.auth = ("memberuser", "secret")

        url = "{}/@customer-satisfaction".format(self.portal_url)
        self.assertEqual(api_session.get(url).status_code, 401)

        setRoles(self.portal, "memberuser", ["Editor", "Reviewer"])
        transaction.commit()
        self.assertEqual(api_session.get(url).status_code, 401)

        api_session.close()

    def test_endpoint_returns_data(self):
        url = "{}/@customer-satisfaction".format(self.portal_url)
        response = self.api_session.get(url)
        res = response.json()
        self.assertEqual(res["items_total"], 0)

        soup = get_soup("customer_satisfaction_soup", self.portal)
        transaction.commit()
        now = datetime.now()
        record = Record()
        record.attrs["vote"] = 1
        record.attrs["comment"] = "is ok"
        record.attrs["date"] = now
        intid = soup.add(record)
        transaction.commit()

        url = "{}/@customer-satisfaction".format(self.portal_url)
        response = self.api_session.get(url)
        res = response.json()

        self.assertEqual(res["items_total"], 1)
        self.assertEqual(
            res["items"],
            [
                {
                    "date": json_compatible(now),
                    "id": intid,
                    "comment": "is ok",
                    "vote": 1,
                }
            ],
        )
