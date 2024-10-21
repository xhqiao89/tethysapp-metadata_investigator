from tethys_sdk.base import TethysAppBase


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