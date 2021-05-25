# -*- coding: utf-8 -*-
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import (
    applyProfile,
    FunctionalTesting,
    IntegrationTesting,
    PloneSandboxLayer,
)
from plone.testing import z2

import rer.customersatisfaction


class RerCustomersatisfactionLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import plone.restapi
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=rer.customersatisfaction)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'rer.customersatisfaction:default')


RER_CUSTOMERSATISFACTION_FIXTURE = RerCustomersatisfactionLayer()


RER_CUSTOMERSATISFACTION_INTEGRATION_TESTING = IntegrationTesting(
    bases=(RER_CUSTOMERSATISFACTION_FIXTURE,),
    name='RerCustomersatisfactionLayer:IntegrationTesting',
)


RER_CUSTOMERSATISFACTION_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(RER_CUSTOMERSATISFACTION_FIXTURE,),
    name='RerCustomersatisfactionLayer:FunctionalTesting',
)


RER_CUSTOMERSATISFACTION_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        RER_CUSTOMERSATISFACTION_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE,
    ),
    name='RerCustomersatisfactionLayer:AcceptanceTesting',
)
