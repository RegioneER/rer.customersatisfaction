# -*- coding: utf-8 -*-
import logging

logger = logging.getLogger(__name__)

DEFAULT_PROFILE = "profile-rer.customersatisfaction:default"


def update_profile(context, profile, run_dependencies=True):
    context.runImportStepFromProfile(DEFAULT_PROFILE, profile, run_dependencies)


def update_types(context):
    update_profile(context, "typeinfo")


def update_rolemap(context):
    update_profile(context, "rolemap")


def update_registry(context):
    update_profile(context, "plone.app.registry", run_dependencies=False)


def update_controlpanel(context):
    update_profile(context, "controlpanel")


def update_catalog(context):
    update_profile(context, "catalog")


def to_2000(context):
    context.runAllImportStepsFromProfile("profile-rer.customersatisfaction:2000")
