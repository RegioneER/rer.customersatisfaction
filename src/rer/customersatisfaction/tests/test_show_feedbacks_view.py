# -*- coding: utf-8 -*-
from AccessControl.unauthorized import Unauthorized
from plone import api
from plone.app.testing import logout, login
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from rer.customersatisfaction.testing import (
    RER_CUSTOMERSATISFACTION_FUNCTIONAL_TESTING,
)
from zope.component import getUtility
from zope.publisher.interfaces import NotFound

import transaction
import unittest


class TestShowFeedbacksTool(unittest.TestCase):

    layer = RER_CUSTOMERSATISFACTION_FUNCTIONAL_TESTING

    def setUp(self):
        self.app = self.layer["app"]
        self.portal = self.layer["portal"]
        self.request = self.layer["request"]

        # define users
        api.user.create(email="user@plone.org", username="user", password="secret")
        api.user.create(
            email="editor@plone.org", username="global_editor", password="secret"
        )
        api.user.create(
            email="editor@plone.org", username="local_editor", password="secret"
        )

        # set roles
        setRoles(self.portal, "global_editor", ["Editor"])
        setRoles(self.portal, TEST_USER_ID, ["Manager"])

        # create some example data
        folder = api.content.create(
            type="Folder",
            title="Private folder",
            container=self.portal,
        )

        self.private_document = api.content.create(
            type="Document",
            title="Private document",
            container=folder,
        )

        self.document = api.content.create(
            type="Document",
            title="Document",
            container=self.portal,
        )

        api.content.transition(obj=self.document, transition="publish")
        api.user.grant_roles(
            username="local_editor", roles=["Editor", "Contributor"], obj=folder
        )

        # now add some comments
        tool = getUtility(ICustomerSatisfactionStore)
        tool.add(
            {
                "uid": self.document.UID(),
                "title": self.document.title,
                "vote": 1,
                "comment": "foo",
            }
        )
        tool.add(
            {
                "uid": self.document.UID(),
                "title": self.document.title,
                "vote": 1,
                "comment": "bar",
            }
        )
        tool.add(
            {
                "uid": self.private_document.UID(),
                "title": self.private_document.title,
                "vote": 1,
                "comment": "baz",
            }
        )

    def tearDown(self):
        tool = getUtility(ICustomerSatisfactionStore)
        tool.clear()
        self.request.form = {}
        transaction.commit()

    @property
    def view(self):
        return api.content.get_view(
            name="show-feedbacks",
            context=self.portal,
            request=self.request,
        )

    def test_call_with_wrong_uid_return_not_found(self):
        self.request.form["uid"] = "xxx"
        self.assertRaises(NotFound, self.view)

    def test_if_user_cant_access_content_raise_not_found(self):
        logout()
        self.request.form["uid"] = self.private_document
        self.assertRaises(NotFound, self.view)

    def test_if_user_can_access_content_but_dont_have_permission_raise_error(self):
        logout()
        self.request.form["uid"] = self.document.UID()
        self.assertRaises(Unauthorized, self.view)

        # also an authenticated member
        login(self.portal, "local_editor")
        self.request.form["uid"] = self.document.UID()
        self.assertRaises(Unauthorized, self.view)

    def test_global_editor_can_access_view(self):
        logout()
        login(self.portal, "global_editor")
        self.request.form["uid"] = self.document.UID()
        res = self.view()

        self.assertIn(
            f'<h1 class="documentFirstHeading">Comments - {self.document.title}</h1>',
            res,
        )

        self.request.form["uid"] = self.private_document.UID()
        res = self.view()

        self.assertIn(
            f'<h1 class="documentFirstHeading">Comments - {self.private_document.title}</h1>',
            res,
        )

    def test_local_editor_can_see_comments_of_items_where_have_permission(self):
        logout()
        login(self.portal, "local_editor")

        self.request.form["uid"] = self.document.UID()
        self.assertRaises(Unauthorized, self.view)

        self.request.form["uid"] = self.private_document.UID()
        res = self.view()

        self.assertIn(
            f'<h1 class="documentFirstHeading">Comments - {self.private_document.title}</h1>',
            res,
        )
