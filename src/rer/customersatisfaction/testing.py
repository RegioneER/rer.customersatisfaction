# -*- coding: utf-8 -*-
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.testing import (
    applyProfile,
    FunctionalTesting,
    IntegrationTesting,
    PloneSandboxLayer,
)
from plone.restapi.testing import PloneRestApiDXLayer
from plone.testing import z2

import collective.MockMailHost
import rer.customersatisfaction
import souper.plone
import plone.restapi

try:
    import collective.recaptcha

    HAS_COLLECTIVE_RECAPTCHA = True
except ImportError:
    HAS_COLLECTIVE_RECAPTCHA = False


class RerCustomersatisfactionLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        if HAS_COLLECTIVE_RECAPTCHA:
            self.loadZCML(package=collective.recaptcha)
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=rer.customersatisfaction)
        self.loadZCML(package=souper.plone)

    def setUpPloneSite(self, portal):
        applyProfile(portal, "rer.customersatisfaction:default")


RER_CUSTOMERSATISFACTION_FIXTURE = RerCustomersatisfactionLayer()


RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING = IntegrationTesting(
    bases=(RER_CUSTOMERSATISFACTION_FIXTURE,),
    name="RerCustomersatisfactionLayer:IntegrationTesting",
)


RER_CUSTOMERSATISFACTION_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(RER_CUSTOMERSATISFACTION_FIXTURE,),
    name="RerCustomersatisfactionLayer:FunctionalTesting",
)


class RerCustomersatisfactionLayerApi(PloneRestApiDXLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        super(RerCustomersatisfactionLayerApi, self).setUpZope(
            app, configurationContext
        )
        if HAS_COLLECTIVE_RECAPTCHA:
            self.loadZCML(package=collective.recaptcha)
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=rer.customersatisfaction)
        self.loadZCML(package=souper.plone)

    def setUpPloneSite(self, portal):
        applyProfile(portal, "rer.customersatisfaction:default")


RER_CUSTOMERSATISFACTION_API_FIXTURE = RerCustomersatisfactionLayerApi()
RER_CUSTOMERSATISFACTION_API_INTEGRATION_TESTING = IntegrationTesting(
    bases=(RER_CUSTOMERSATISFACTION_API_FIXTURE,),
    name="RerCustomersatisfactionLayerApi:Integration",
)

RER_CUSTOMERSATISFACTION_API_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(RER_CUSTOMERSATISFACTION_API_FIXTURE, z2.ZSERVER_FIXTURE),
    name="RerCustomersatisfactionLayerApi:Functional",
)
