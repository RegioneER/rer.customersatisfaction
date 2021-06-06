# -*- coding: utf-8 -*-
from plone import api
from rer.customersatisfaction.interfaces import ICustomerSatisfactionStore
from zExceptions import BadRequest
from rer.customersatisfaction.restapi.services.common import DataAdd
from collective.recaptcha.settings import IRecaptchaSettings

import requests
import logging

logger = logging.getLogger(__name__)


class CustomerSatisfactionAdd(DataAdd):
    """
    Called on context
    """

    store = ICustomerSatisfactionStore

    def validate_form(self, form_data):
        """
        check all required fields and parameters
        """
        for field in ["vote"]:
            value = form_data.get(field, "")
            if not value:
                raise BadRequest(
                    "Campo obbligatorio mancante: {}".format(field)
                )
            try:
                int_value = int(value)
                if int_value not in [1, -1]:
                    raise BadRequest(
                        "Il voto deve essere un valore valido: 1 o -1."
                    )
            except Exception as e:
                logger.exception(e)
                raise BadRequest(
                    "Il voto deve essere un valore valido: 1 o -1."
                )
        self.check_recaptcha(form_data)

    def check_recaptcha(self, form_data):
        if "g-recaptcha-response" not in form_data:
            raise BadRequest("Campo obbligatorio mancante: captcha")

        secret = api.portal.get_registry_record(
            "private_key", interface=IRecaptchaSettings
        )
        payload = {
            "response": form_data["g-recaptcha-response"],
            "secret": secret,
        }
        response = requests.post(
            url="https://www.google.com/recaptcha/api/siteverify", data=payload
        )
        result = response.json()
        if not result.get("success", False):
            raise BadRequest("Captcha errato")
        return True

    def extract_data(self, form_data):
        data = super(CustomerSatisfactionAdd, self).extract_data(form_data)

        context_state = api.content.get_view(
            context=self.context,
            request=self.request,
            name=u"plone_context_state",
        )
        context = context_state.canonical_object()
        data["uid"] = context.UID()
        data["title"] = context.Title()
        data["vote"] = int(data["vote"])
        if "g-recaptcha-response" in data:
            del data["g-recaptcha-response"]
        return data
