# -*- coding: utf-8 -*-
from rer.customersatisfaction.testing import (
    RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING,
)
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import SITE_OWNER_NAME
from plone.app.testing import SITE_OWNER_PASSWORD
from plone.app.testing import TEST_USER_ID
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from plone.restapi.testing import RelativeSession
from zope.component import getUtility

import transaction
import unittest
import requests_mock
import os


class TestCustomerSatisfactionAdd(unittest.TestCase):

    layer = RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING

    def setUp(self):
        os.environ["RECAPTCHA_PRIVATE_KEY"] = "foo"
        self.app = self.layer["app"]
        self.portal = self.layer["portal"]
        self.portal_url = self.portal.absolute_url()
        setRoles(self.portal, TEST_USER_ID, ["Manager"])

        api.user.create(
            email="memberuser@example.com",
            username="memberuser",
            password="secret",
        )

        self.document = api.content.create(
            title="Document", container=self.portal, type="Document"
        )

        self.api_session = RelativeSession(self.portal_url)
        self.api_session.headers.update({"Accept": "application/json"})
        self.api_session.auth = (SITE_OWNER_NAME, SITE_OWNER_PASSWORD)
        self.anon_api_session = RelativeSession(self.portal_url)
        self.anon_api_session.headers.update({"Accept": "application/json"})

        self.url = "{}/@customer-satisfaction-add".format(self.document.absolute_url())
        transaction.commit()

    def tearDown(self):
        self.api_session.close()
        self.anon_api_session.close()

    def test_anon_can_post_data(self):
        # 400 because there are some missing fields
        self.assertEqual(self.anon_api_session.post(self.url, json={}).status_code, 400)

    @requests_mock.Mocker(real_http=True)
    def test_required_params(self, m):
        """
        email and channel are required.
        """
        self.assertEqual(self.anon_api_session.post(self.url).status_code, 400)

        # vote is required
        res = self.anon_api_session.post(self.url, json={})
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.json()["message"], "Campo obbligatorio mancante: vote")
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": False},
        )

        # captcha is required
        res = self.anon_api_session.post(self.url, json={"vote": "ok"})
        self.assertEqual(res.status_code, 400)
        self.assertEqual(
            res.json()["message"], "Campo obbligatorio mancante: Non sono un robot"
        )

        # captcha code is invalid
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": False},
        )
        res = self.anon_api_session.post(
            self.url, json={"vote": "ok", "g-recaptcha-response": "xyz"}
        )
        self.assertEqual(res.status_code, 400)
        self.assertEqual(
            res.json()["message"],
            "Validazione richiesta per il campo: Non sono un robot",
        )

        # captcha code is valid
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": True},
        )
        res = self.anon_api_session.post(
            self.url, json={"vote": "ok", "g-recaptcha-response": "xyz"}
        )
        self.assertEqual(res.status_code, 204)

    @requests_mock.Mocker(real_http=True)
    def test_validate_vote(self, m):
        # mock captcha verification
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": True},
        )
        resp = self.anon_api_session.post(
            self.url,
            json={"vote": 1, "comment": "i disagree", "g-recaptcha-response": "xyz"},
        )
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["message"], "Voto non valido: 1")

    @requests_mock.Mocker(real_http=True)
    def test_correctly_save_data(self, m):
        # mock captcha verification
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": True},
        )
        self.anon_api_session.post(
            self.url,
            json={
                "vote": "ok",
                "comment": "i disagree",
                "g-recaptcha-response": "xyz",
            },
        )
        transaction.commit()
        tool = getUtility(ICustomerSatisfactionStore)
        self.assertEqual(len(tool.search()), 1)

    @requests_mock.Mocker(real_http=True)
    def test_store_only_known_fields(self, m):
        # mock captcha verification
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": True},
        )
        self.anon_api_session.post(
            self.url,
            json={
                "vote": "nok",
                "comment": "i disagree",
                "unknown": "mistery",
                "g-recaptcha-response": "xyz",
            },
        )
        transaction.commit()
        tool = getUtility(ICustomerSatisfactionStore)
        res = tool.search()
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0]._attrs.get("unknown", None), None)
        self.assertEqual(res[0]._attrs.get("vote", None), "nok")
        self.assertEqual(res[0]._attrs.get("comment", None), "i disagree")

    @requests_mock.Mocker(real_http=True)
    def test_raise_error_if_private_key_not_set(self, m):
        """ """
        del os.environ["RECAPTCHA_PRIVATE_KEY"]

        # captcha code is valid
        m.post(
            "https://www.google.com/recaptcha/api/siteverify",
            json={"success": True},
        )
        res = self.anon_api_session.post(
            self.url, json={"vote": "ok", "g-recaptcha-response": "xyz"}
        )
        self.assertEqual(res.status_code, 400)

    def test_skip_captcha_validation_with_flag(self):

        api.portal.set_registry_record(
            "rer.customersatisfaction.disable_recaptcha", True
        )
        transaction.commit()

        res = self.anon_api_session.post(
            self.url,
            json={
                "vote": "ok",
                "comment": "i disagree",
            },
        )
        self.assertNotEqual(res.status_code, 400)
        self.assertEqual(res.status_code, 204)

        transaction.commit()
        tool = getUtility(ICustomerSatisfactionStore)
        self.assertEqual(len(tool.search()), 1)

        # go back with default value
        api.portal.set_registry_record(
            "rer.customersatisfaction.disable_recaptcha", False
        )
        transaction.commit()
