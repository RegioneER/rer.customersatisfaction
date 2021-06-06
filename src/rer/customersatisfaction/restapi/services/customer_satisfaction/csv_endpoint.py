# -*- coding: utf-8 -*-
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from rer.customersatisfaction.restapi.services.common import DataCSVGet

import logging

logger = logging.getLogger(__name__)

COLUMNS = [
    "title",
    "url",
    "vote",
    "comment",
    "date",
]


class CustomerSatisfactionCSVGet(DataCSVGet):
    """
    UNUSED RIGHT NOW
    """

    type = "customer_satisfaction"
    store = ICustomerSatisfactionStore
    columns = COLUMNS
