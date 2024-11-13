from tethys_sdk.base import TethysAppBase
from tethys_sdk.app_settings import CustomSetting
from tethys_sdk.routing import url_map_maker


class MetadataInvestigator(TethysAppBase):
    """
    Tethys app class for Metadata Investigator.
    """

    name = 'Metadata Investigator'
    description = 'Create, validate, and manage metadata file for hydrographic data following IHO S100 standard'
    package = 'metadata_investigator'  # WARNING: Do not change this value
    index = 'home'
    icon = f'{package}/images/icon.gif'
    root_url = 'metadata-investigator'
    color = '#5f27cd'
    tags = 'Hydrographic, IHO S100, Metadata'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        url_map = url_map_maker(self.root_url)

        url_maps = [
            url_map(
                name='home',
                url='',
                controller='metadata_investigator.controllers.home'
            ),
            url_map(
                name='upload_file',
                url='upload',
                controller='metadata_investigator.controllers.upload_file'
            ),
        ]

        return url_maps