# -*- coding: utf-8 -*-
from plone.app.registry.browser import controlpanel
from rer.customersatisfaction import _
from rer.customersatisfaction.interfaces import (
    IRerCustomersatisfactionSettings,
)


class CustomersatisfactionSettingsEditForm(controlpanel.RegistryEditForm):
    """
    """

    schema = IRerCustomersatisfactionSettings
    id = "CustomerSatisfactionSettingsEditForm"
    label = _(u"Customer satisfaction settings")
    description = u""


class CustomersatisfactionSettingsControlPanel(
    controlpanel.ControlPanelFormWrapper
):
    """
    """

    form = CustomersatisfactionSettingsEditForm
