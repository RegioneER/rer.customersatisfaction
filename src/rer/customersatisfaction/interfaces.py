# -*- coding: utf-8 -*-
"""Module where all interfaces, events and exceptions live."""

from zope.publisher.interfaces.browser import IDefaultBrowserLayer
from zope.interface import Interface
from zope.interface.interfaces import IObjectEvent


class ICustomerSatisfactionStore(Interface):
    """Marker interface"""


class IRerCustomersatisfactionLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IVoteAddedEvent(IObjectEvent):
    """Vote added"""
