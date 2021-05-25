# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from plone.app.testing import setRoles, TEST_USER_ID
from rer.customersatisfaction.testing import (
    RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING  # noqa: E501,
)

import unittest


try:
    from Products.CMFPlone.utils import get_installer
except ImportError:
    get_installer = None


class TestSetup(unittest.TestCase):
    """Test that rer.customersatisfaction is properly installed."""

    layer = RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        if get_installer:
            self.installer = get_installer(self.portal, self.layer['request'])
        else:
            self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if rer.customersatisfaction is installed."""
        self.assertTrue(self.installer.isProductInstalled(
            'rer.customersatisfaction'))

    def test_browserlayer(self):
        """Test that IRerCustomersatisfactionLayer is registered."""
        from rer.customersatisfaction.interfaces import (
            IRerCustomersatisfactionLayer)
        from plone.browserlayer import utils
        self.assertIn(
            IRerCustomersatisfactionLayer,
            utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        if get_installer:
            self.installer = get_installer(self.portal, self.layer['request'])
        else:
            self.installer = api.portal.get_tool('portal_quickinstaller')
        roles_before = api.user.get_roles(TEST_USER_ID)
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.installer.uninstallProducts(['rer.customersatisfaction'])
        setRoles(self.portal, TEST_USER_ID, roles_before)

    def test_product_uninstalled(self):
        """Test if rer.customersatisfaction is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled(
            'rer.customersatisfaction'))

    def test_browserlayer_removed(self):
        """Test that IRerCustomersatisfactionLayer is removed."""
        from rer.customersatisfaction.interfaces import \
            IRerCustomersatisfactionLayer
        from plone.browserlayer import utils
        self.assertNotIn(
            IRerCustomersatisfactionLayer,
            utils.registered_layers())
