# -*- coding: utf-8 -*-
from plone import api
from plone.app.upgrade.utils import installOrReinstallProduct
from Products.CMFPlone.interfaces import INonInstallable
from zope.interface import implementer

try:
    from collective.recaptcha.settings import IRecaptchaSettings  # noqa

    HAS_COLLECTIVE_RECAPTCHA = True
except ImportError:
    HAS_COLLECTIVE_RECAPTCHA = False


@implementer(INonInstallable)
class HiddenProfiles(object):
    def getNonInstallableProfiles(self):
        """Hide uninstall profile from site-creation and quickinstaller."""
        return [
            "rer.customersatisfaction:uninstall",
            "rer.customersatisfaction:collective_recaptcha",
        ]


def post_install(context):
    """Post install script"""
    if HAS_COLLECTIVE_RECAPTCHA:
        # install it and customize it.
        installOrReinstallProduct(api.portal.get(), "collective.recaptcha")
        context.runAllImportStepsFromProfile(
            "profile-rer.customersatisfaction:collective_recaptcha"
        )


def uninstall(context):
    """Uninstall script"""
    # Do something at the end of the uninstallation of this package.
