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

        api.user.create(
            email="member@example.com",
            username="member",
            password="secret",
        )
        api.user.create(
            email="global@example.com",
            username="global",
            password="secret",
        )

        api.user.create(
            email="local@example.com",
            username="local",
            password="secret",
        )

        # create some contents
        self.document = api.content.create(
            title="document", container=self.portal, type="Document"
        )
        api.content.transition(obj=self.document, transition="publish")

        self.restricted_document = api.content.create(
            title="restricted document", container=self.portal, type="Document"
        )

        transaction.commit()

        api.user.grant_roles(
            username="global",
            roles=["Editor"],
        )
        api.user.grant_roles(
            username="local", roles=["Editor"], obj=self.restricted_document
        )

        self.api_session = RelativeSession(self.portal_url)
        self.api_session.headers.update({"Accept": "application/json"})
        self.api_session.auth = (SITE_OWNER_NAME, SITE_OWNER_PASSWORD)

        transaction.commit()

    def tearDown(self):
        self.api_session.close()
        soup = get_soup("customer_satisfaction_soup", self.portal)
        soup.clear()

    def test_anon_cant_access_endpoint(self):
        api_session = RelativeSession(self.portal_url)
        api_session.headers.update({"Accept": "application/json"})
        self.assertEqual(api_session.get(self.url).status_code, 401)

    def test_admin_can_access_endpoint(self):
        self.assertEqual(self.api_session.get(self.url).status_code, 200)

    def test_other_users_can_access_endpoint(self):
        for username in ["member", "local", "global"]:
            api_session = RelativeSession(self.portal_url)
            api_session.headers.update({"Accept": "application/json"})
            api_session.auth = (username, "secret")

            self.assertEqual(api_session.get(self.url).status_code, 200)

    def test_endpoint_returns_data(self):
        response = self.api_session.get(self.url)
        res = response.json()
        self.assertEqual(res["items_total"], 0)

        now = datetime.now()
        self.add_record(vote=1, date=now, comment="is ok")

        response = self.api_session.get(self.url)
        res = response.json()

        self.assertEqual(res["items_total"], 1)

        self.assertEqual(
            res["items"],
            [
                {
                    "comments": [
                        {"comment": "is ok", "date": json_compatible(now), "vote": 1}
                    ],
                    "last_vote": json_compatible(now),
                    "nok": 0,
                    "ok": 0,
                    "review_ids": [],
                    "title": "",
                    "uid": "",
                }
            ],
        )

    def test_basic_user_cant_see_data(self):
        now = datetime.now()
        self.add_record(
            vote=1, date=now, comment="is ok for member", uid=self.document.UID()
        )
        api_session = RelativeSession(self.portal_url)
        api_session.headers.update({"Accept": "application/json"})
        api_session.auth = ("member", "secret")

        response = api_session.get(self.url)
        res = response.json()

        self.assertEqual(res["items_total"], 0)

    def test_global_editor_can_see_all_data(self):
        now = datetime.now()
        self.add_record(
            vote=1, date=now, comment="is ok for global", uid=self.document.UID()
        )
        self.add_record(
            vote=1,
            date=now,
            comment="ok also for restricted",
            uid=self.restricted_document.UID(),
        )
        api_session = RelativeSession(self.portal_url)
        api_session.headers.update({"Accept": "application/json"})
        api_session.auth = ("global", "secret")

        response = api_session.get(self.url)
        res = response.json()

        self.assertEqual(res["items_total"], 2)

    def test_local_editor_can_see_only_data_for_his_contents(self):
        now = datetime.now()
        self.add_record(
            vote=1, date=now, comment="is ok for global", uid=self.document.UID()
        )
        self.add_record(
            vote=1,
            date=now,
            comment="ok also for restricted",
            uid=self.restricted_document.UID(),
        )
        api_session = RelativeSession(self.portal_url)
        api_session.headers.update({"Accept": "application/json"})
        api_session.auth = ("local", "secret")

        response = api_session.get(self.url)
        res = response.json()

        self.assertEqual(res["items_total"], 1)
        self.assertEqual(res["items"][0]["uid"], self.restricted_document.UID())

    def test_only_admins_can_see_deleted_contents(self):
        now = datetime.now()
        self.add_record(vote=1, date=now, comment="is ok", uid=self.document.UID())
        self.add_record(
            vote=1,
            date=now,
            comment="ok for deleted content",
            uid="qwertyuiop",
        )

        response = self.api_session.get(self.url)
        res = response.json()
        self.assertEqual(res["items_total"], 2)

        api_session = RelativeSession(self.portal_url)
        api_session.headers.update({"Accept": "application/json"})
        api_session.auth = ("global", "secret")

        response = api_session.get(self.url)
        res = response.json()

        self.assertEqual(res["items_total"], 1)
