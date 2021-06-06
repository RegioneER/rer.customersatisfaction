# -*- coding: utf-8 -*-
from plone.supermodel import model
from rer.customersatisfaction import _
from zope import schema
from zope.publisher.interfaces.browser import IDefaultBrowserLayer
from zope.interface import Interface


class ICustomerSatisfactionStore(Interface):
    """Marker interface"""


class IRerCustomersatisfactionLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IRerCustomersatisfactionSettings(model.Schema):
    portal_types = schema.Tuple(
        title=_(
            "customer_satisfaction_settings_portal_types",
            default=u"Portal types",
        ),
        description=_(
            "customer_satisfaction_settings_portal_types_help",
            default=u"Select which portal_types where enable reviews.",
        ),
        required=True,
        value_type=schema.Choice(
            vocabulary=u"plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
    )
