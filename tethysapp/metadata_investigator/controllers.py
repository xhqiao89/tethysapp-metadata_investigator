from tethys_sdk.routing import controller
from tethys_sdk.gizmos import Button
import json
import os
import xmltodict
from django.shortcuts import render
from tethys_sdk.gizmos import MapView


@controller
def home(request):
    """
    Controller for the app home page.
    """
    save_button = Button(
        display_text='',
        name='save-button',
        icon='save',
        style='success',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Save'
        }
    )

    edit_button = Button(
        display_text='',
        name='edit-button',
        icon='pen',
        style='warning',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Edit'
        }
    )

    remove_button = Button(
        display_text='',
        name='remove-button',
        icon='trash',
        style='danger',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Remove'
        }
    )

    previous_button = Button(
        display_text='Previous',
        name='previous-button',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Previous'
        }
    )

    next_button = Button(
        display_text='Next',
        name='next-button',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Next'
        }
    )

    map_view_options = {
        'height': '500px',
        'width': '100%',
        'controls': ['ZoomSlider', 'Rotate', 'FullScreen'],
        'layers': [],
        'view': {
            'projection': 'EPSG:4326',
            'center': [-110, 39.5],  # Default center of the map
            'zoom': 6
        },
        'basemap': 'OpenStreetMap',
    }
    map_view_gizmo = MapView(**map_view_options)

    context = {
        'save_button': save_button,
        'edit_button': edit_button,
        'remove_button': remove_button,
        'previous_button': previous_button,
        'next_button': next_button,
        'map_view_gizmo': map_view_gizmo
    }

    return render(request, 'metadata_investigator/home.html', context)


# Define the XML namespaces for the elements
namespaces = {
    'S100FC': 'http://www.isotc211.org/2005/gmd',  # Namespace for S100FC
    'gco': 'http://www.isotc211.org/2005/gco',  # Namespace for gco
}

def flatten_json(data, parent_key='', sep='.', namespace_remove=['S100FC:', 'gco:']):
    items = {}
    if isinstance(data, dict):
        for k, v in data.items():
            # Remove any unwanted namespaces from the key
            for ns in namespace_remove:
                k = k.replace(ns, '')
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            items.update(flatten_json(v, new_key, sep=sep, namespace_remove=namespace_remove))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            items.update(flatten_json(item, f"{parent_key}{sep}{i}", sep=sep, namespace_remove=namespace_remove))
    else:
        items[parent_key] = data
    return items

def remove_xmlns_entries(flattened_data):
    # Use a dictionary comprehension to filter out unwanted keys(First two entries in dictionary)
    return {k: v for k, v in flattened_data.items() if "@xmlns" not in k}

@controller(name='upload_file', url='metadata-investigator/upload')
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']

        ##If not xml return error
        if not uploaded_file.name.endswith('.xml'):
            return render(request, 'metadata_investigator/home.html', {'error': 'Please upload an XML file'})

        # Converting XML to dictionary
        file_content = uploaded_file.read()
        xml_dict = xmltodict.parse(file_content)
        # print('XML DICT is: ', xml_dict)

        json_data = json.dumps(xml_dict, indent=4)
        # println('JSON DATA: ', json_data)
        flattened_data = flatten_json(xml_dict)
        clean_data = remove_xmlns_entries(flattened_data)
        # println('Flattened and clean Data:', clean_data)

        data_to_send = {
            'metadataIdentifier': flattened_data.get('MD_Metadata.metadataIdentifier.CharacterString', ''),
            'DatasetTitle': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.citation.CI_Citation.title.CharacterString', ''),
            'IdentificationAbstract': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.abstract.CharacterString', ''),
            'publicationDate': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.citation.CI_Citation.date.CI_Date.date.Date', ''),
            'DatasetFormat': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.distributionFormat.MD_Format.name.CharacterString',''),
            # Topic Category Missing
            'OnlineLinkToDataset': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.transferOptions.MD_DigitalTransferOptions.onLine.CI_OnlineResource.linkage.CharacterString', ''),
            'IdentificationKeywords': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.descriptiveKeywords.MD_Keywords.keyword.CharacterString', ''),
            'DataAccessConstraints': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.resourceConstraints.MD_Constraints.accessLimitations.CharacterString', ''),
            'DataUseConstraints': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.resourceConstraints.MD_Constraints.useLimitations.CharacterString', ''),

            'DataQualityScope': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.scope.DQ_Scope.level.CharacterString', ''),
            'LineageStatement': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.lineage.LI_Lineage.statement.CharacterString', ''),
            'ProcessStepDescription': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.processStep.LI_ProcessStep.description.CharacterString',''),
            'ProcessStepDate': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.processStep.LI_ProcessStep.date.Date', ''),
            'ProcessorName': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.processStep.LI_ProcessStep.processor.CI_ResponsibleParty.individualName.CharacterString',''),
            'SourceTitle': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.source.LI_Source.title.CharacterString', ''),
            'ReportAbstract': flattened_data.get('MD_Metadata.dataQualityInfo.DQ_DataQuality.report.DQ_Element.abstract.CharacterString', ''),

            'descriptionOfGeographicExtent': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.extent.EX_Extent.description.CharacterString', ''),
            'WestBoundLongitude': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.extent.EX_Extent.geographicElement.EX_GeographicBoundingBox.westBoundLongitude.Decimal',''),
            'EastBoundLongitude': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.extent.EX_Extent.geographicElement.EX_GeographicBoundingBox.eastBoundLongitude.Decimal',''),
            'NorthBoundLatitude': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.extent.EX_Extent.geographicElement.EX_GeographicBoundingBox.northBoundLatitude.Decimal',''),
            'SouthBoundLatitude': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.extent.EX_Extent.geographicElement.EX_GeographicBoundingBox.southBoundLatitude.Decimal',''),
            'ReferenceSystemCode': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.referenceSystemInfo.MD_ReferenceSystem.referenceSystemIdentifier.RS_Identifier.code.CharacterString',''),
            'ReferenceSystemVersion': flattened_data.get('MD_Metadata.identificationInfo.MD_DataIdentification.referenceSystemInfo.MD_ReferenceSystem.referenceSystemIdentifier.RS_Identifier.version.CharacterString',''),

            #Missing Organization Name
            'IndividualName': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.individualName.CharacterString', ''),
            'PositionName': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.positionName.CharacterString',''),
            'ContactPhone': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.contactInfo.CI_Contact.phone.CI_Telephone.CharacterString',''),
            'FaxNumber': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.faxNumber.CharacterString', ''),
            'EmailAddress': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.email.CharacterString', ''),
            'Address1': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.address1.CharacterString', ''),
            'Address2': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.address2.CharacterString', ''),
            'Address3': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.address3.CharacterString', ''),
            'City': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.city.CharacterString', ''),
            'StateProvince': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.state.CharacterString', ''),
            'PostalCode': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.zipcode.CharacterString', ''),
            'Country': flattened_data.get('MD_Metadata.contact.CI_ResponsibleParty.country.CharacterString', '')
        }

        return render(request, 'metadata_investigator/home.html', {'data': data_to_send})

    return render(request, 'metadata_investigator/home.html')


