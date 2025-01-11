from django.shortcuts import render
from django.http import JsonResponse
from tethys_sdk.routing import controller
from tethys_sdk.gizmos import Button
import json
import os
from django.conf import settings
import xml.parsers.expat
import xmltodict
from jsonschema import validate, ValidationError
import xml.etree.ElementTree as ET
from django.shortcuts import render
from django.http import JsonResponse

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


# Commenting out from below to end

# current_dir = os.path.dirname(os.path.abspath(__file__))
# schema_path = os.path.join(current_dir, 'templates', 'metadata_investigator', 'schema', 'schema_3.json')
#
# # Loading the JSON schema
# with open(schema_path, 'r') as schema_file:
#     json_schema = json.load(schema_file)
#
#
# @controller(name='upload_file', url='metadata-investigator/upload')
# def upload_file(request):
#     if request.method == 'POST' and request.FILES.get('file'):
#         uploaded_file = request.FILES['file']
#
#         if not uploaded_file.name.endswith('.xml'):
#             return render(request, 'metadata_investigator/home.html', {'error': 'Please upload an XML file.'})
#
#         # Read and parse the XML file
#         xml_content = uploaded_file.read().decode('utf-8')
#         try:
#             # Convert XML to JSON, with namespace stripping
#             json_data = xmltodict.parse(xml_content, namespaces=False)
#
#             # Strip out the namespaces from the keys
#             json_data = remove_namespaces(json_data)
#             return render(request, 'metadata_investigator/home.html', {'error': f'Error parsing XML: Debug'})
#             # Validate against JSON schema
#             # validate(instance=json_data, schema=json_schema)
#         except xml.parsers.expat.ExpatError as e:
#             return render(request, 'metadata_investigator/home.html', {'error': f'Error parsing XML: {str(e)}'})
#         except ValidationError as e:
#             return render(request, 'metadata_investigator/home.html', {'error': f'Schema validation error: {str(e)}'})
#         except Exception as e:
#             return render(request, 'metadata_investigator/home.html', {'error': f'Error: {str(e)}'})
#
#         # Extract metadata safely
#         metadata = json_data.get('MD_Metadata', {})
#
#         # Ensure that 'MD_Metadata' is not a boolean (if it is, return an error)
#         if isinstance(metadata, bool):
#             return render(request, 'metadata_investigator/home.html', {'error': 'Invalid metadata structure in the XML (boolean found).'})
#
#         # Process attributes for each group
#         identification_attributes = handle_identification(metadata)
#         data_quality_attributes = handle_data_quality(metadata)
#         spatial_coverage_attributes = handle_spatial_coverage(metadata)
#         metadata_reference_attributes = handle_metadata_reference(metadata)
#
#         # Combine all attributes
#         attributes = {**identification_attributes, **data_quality_attributes,
#                       **spatial_coverage_attributes, **metadata_reference_attributes}
#
#         # Handle missing attributes
#         required_fields = [
#             'metadata-identifier', 'title', 'abstract', 'publication-date',
#             'dataset-format', 'topic-category', 'descriptionGeographicExtent',
#             'westBoundLongitude', 'eastBoundLongitude', 'northBoundLatitude', 'southBoundLatitude',
#             'organizationName', 'telephoneNumber', 'address1', 'zipcode',
#             'city', 'stateProvince', 'country'
#         ]
#         attributes, missing_attributes = get_required_attributes(metadata, required_fields)
#
#         return render(request, 'metadata_investigator/display_attributes.html', {
#             'attributes': attributes,
#             'missing_attributes': missing_attributes,
#             'full_json': json.dumps(json_data, indent=2)
#         })
#
#
#
# def remove_namespaces(data):
#     # """Recursively remove namespaces from XML to match the expected schema structure."""
#     # if isinstance(data, bool):
#     #     # If the data is a boolean, return it as is, to prevent errors
#     #     return data
#     # elif isinstance(data, dict):
#     #     return {key.split(':')[-1]: remove_namespaces(value) for key, value in data.items()}
#     # elif isinstance(data, list):
#     #     return [remove_namespaces(item) for item in data]
#     # else:
#         return data
#
#
#
# def handle_identification(metadata):
#     # Identification group: Title, Abstract, Topic Category
#     identification_info = metadata.get('identificationInfo', {})
#
#     if isinstance(identification_info, bool):
#         identification_info = {}
#
#     return {
#         'title': identification_info.get('title', ''),
#         'abstract': identification_info.get('abstract', ''),
#         'topicCategory': identification_info.get('topicCategory', '')
#     }
#
# def handle_data_quality(metadata):
#     # Data Quality group: This can be extended based on your schema, example fields
#     data_quality_info = metadata.get('dataQualityInfo', {})
#     return {
#         'qualityScope': data_quality_info.get('qualityScope', 'Not available'),
#         'qualityStatement': data_quality_info.get('qualityStatement', 'Not available')
#     }
#
# def handle_spatial_coverage(metadata):
#     # Spatial Coverage: Coordinates and geographic description
#     spatial_coverage = metadata.get('S100FC:S100_FC_FeatureCatalogue', {}).get('S100FC:spatialCoverage', {})
#     if not spatial_coverage:
#         return {
#             'geographicDescription': 'Not available',
#             'westBoundLongitude': 'Not available',
#             'eastBoundLongitude': 'Not available',
#             'southBoundLatitude': 'Not available',
#             'northBoundLatitude': 'Not available'
#         }
#
#     return {
#         'geographicDescription': spatial_coverage.get('S100FC:geographicDescription', 'Not available'),
#         'westBoundLongitude': spatial_coverage.get('S100FC:westBoundLongitude', 'Not available'),
#         'eastBoundLongitude': spatial_coverage.get('S100FC:eastBoundLongitude', 'Not available'),
#         'southBoundLatitude': spatial_coverage.get('S100FC:southBoundLatitude', 'Not available'),
#         'northBoundLatitude': spatial_coverage.get('S100FC:northBoundLatitude', 'Not available')
#     }
#
# def handle_metadata_reference(metadata):
#     # Metadata Reference group: Example fields from the metadata reference schema
#     metadata_reference_info = metadata.get('metadataReference', {})
#     return {
#         'referenceSystem': metadata_reference_info.get('referenceSystem', 'Not available'),
#         'datasetIdentifier': metadata_reference_info.get('datasetIdentifier', 'Not available')
#     }
#
# def get_required_attributes(metadata, required_fields):
#     attributes = {}
#     missing_attributes = {}
#
#     for field in required_fields:
#         value = ''
#         if field in ['descriptionGeographicExtent', 'westBoundLongitude', 'eastBoundLongitude', 'northBoundLatitude', 'southBoundLatitude']:
#             value = metadata.get(field, '')
#         elif field == 'metadata-identifier':
#             value = metadata.get('metadataIdentifier', '')
#         else:
#             value = metadata.get(field, '')
#
#         attributes[field] = value
#         missing_attributes[field] = "Missing" if value == '' else "Present"
#
#     return attributes, missing_attributes

## End of commenting out

## Start of older version of upload

# Define the XML namespaces for the elements
namespaces = {
    'S100FC': 'http://www.isotc211.org/2005/gmd',  # Namespace for S100FC
    'gco': 'http://www.isotc211.org/2005/gco',  # Namespace for gco
}

# Load the JSON schema (already present in your code)
current_dir = os.path.dirname(os.path.abspath(__file__))
schema_path = os.path.join(current_dir, 'templates', 'metadata_investigator', 'schema', 'my_schema.json')

with open(schema_path, 'r') as schema_file:
    json_schema = json.load(schema_file)


@controller(name='upload_file', url='metadata-investigator/upload')
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']

        # Check if the uploaded file is an XML
        if not uploaded_file.name.endswith('.xml'):
            return render(request, 'metadata_investigator/home.html', {'error': 'Please upload an XML file.'})

        try:
            # Parse the XML file
            tree = ET.parse(uploaded_file)
            root = tree.getroot()

            # Initialize a dictionary to store the extracted data
            extracted_data = {}

            # Define the full mapping between XML tags and form field names
            field_mapping = {
                # Identification section
                'MD_Metadata.metadataIdentifier': 'metadataIdentifier',
                'MD_Metadata.identificationInfo > MD_DataIdentification.citation > CI_Citation.title': 'title',
                'MD_Metadata.identificationInfo > MD_DataIdentification.abstract': 'abstract',
                'MD_Metadata.identificationInfo > MD_DataIdentification.citation > CI_Citation.date > CI_Date.date': 'publicationDate',
                'MD_Metadata.identificationInfo > MD_Identification.topicCategory': 'topicCategory',
                'MD_Metadata.identificationInfo > MD_DataIdentification.descriptiveKeywords > MD_Keywords.keyword': 'keywords',
                'MD_Metadata.identificationInfo > MD_DataIdentification.resourceConstraints > MD_Constraints.accessLimitations': 'accessLimitations',
                'MD_Metadata.identificationInfo > MD_DataIdentification.resourceConstraints > MD_Constraints.useLimitations': 'useLimitations',
                'MD_Metadata.identificationInfo > MD_DataIdentification.distributionFormat > MD_Format.name': 'datasetFormat',
                'MD_Metadata.identificationInfo > MD_DataIdentification.transferOptions > MD_DigitalTransferOptions.onLine > CI_OnlineResource.linkage': 'onlineLinkToDataset',

                # Data Quality section
                'MD_Metadata.dataQualityInfo > DQ_DataQuality.scope > DQ_Scope.level': 'dataQualityScope',
                'MD_Metadata.lineage > LI_Lineage.statement': 'dataLineageSummary',
                'MD_Metadata.lineage > LI_Lineage.processStep > LI_ProcessStep.description': 'processStep',
                'MD_Metadata.lineage > LI_Lineage.processStep > LI_ProcessStep.date': 'processDate',
                'MD_Metadata.lineage > LI_Lineage.processStep > LI_ProcessStep.processor > CI_ResponsibleParty.individualName': 'processStepContact',
                'MD_Metadata.lineage > LI_Lineage.processStep > LI_ProcessStep.processor > CI_ResponsibleParty.organisationName': 'processStepContactOrganization',
                'MD_Metadata.lineage > LI_Lineage.source > LI_Source.title': 'dataSourceTitle',
                'MD_Metadata.lineage > LI_Lineage.source > LI_Source.description': 'onlineLinkToDataSource',
                'MD_Metadata.dataQualityInfo > DQ_DataQuality.report > DQ_Element.abstract': 'dataAccuracyReport',

                # Spatial Coverage section
                'MD_Metadata.identificationInfo > MD_DataIdentification.extent > EX_Extent.description': 'descriptionOfGeographicExtent',
                'MD_Metadata.identificationInfo > MD_DataIdentification.extent > EX_Extent.geographicElement > EX_GeographicBoundingBox': 'boundingBoxCoordinates',
                'MD_Metadata.identificationInfo > MD_DataIdentification.extent > EX_Extent.referenceSystemInfo > MD_ReferenceSystem.referenceSystemIdentifier > RS_Identifier.code': 'spatialReferenceSystemCode',
                'MD_Metadata.identificationInfo > MD_DataIdentification.extent > EX_Extent.referenceSystemInfo > MD_ReferenceSystem.referenceSystemIdentifier > RS_Identifier.version': 'spatialReferenceSystemVersion',

                # Metadata Reference section
                'MD_Metadata.contact > CI_ResponsibleParty.organisationName': 'organizationName',
                'MD_Metadata.contact > CI_ResponsibleParty.individualName': 'contactPerson',
                'MD_Metadata.contact > CI_ResponsibleParty.positionName': 'position',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.phone': 'telephone',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.address > CI_Address.electronicMailAddress': 'email',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.address > CI_Address.deliveryPoint': 'address',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.address > CI_Address.city': 'city',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.address > CI_Address.state': 'stateProvince',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.address > CI_Address.postalCode': 'zipcode',
                'MD_Metadata.contact > CI_ResponsibleParty.contactInfo > CI_Contact.address > CI_Address.country': 'country',
            }

            # Traverse the XML tree to extract elements and their text content
            for elem in root.iter():
                # Check if the tag name exists in the field_mapping using the full tag with namespace
                tag_name = f'{{{namespaces.get("S100FC")}}}{elem.tag.split("}")[-1]}' if elem.tag.startswith(
                    "{") else elem.tag

                # Check if the tag_name exists in the field_mapping
                if tag_name in field_mapping:
                    # Map the XML tag to the corresponding form field
                    form_field = field_mapping[tag_name]

                    # Extract text content if it's not just whitespace
                    text_content = elem.text.strip() if elem.text else None

                    # If the element has text content, add it to the dictionary
                    if text_content:
                        extracted_data[form_field] = text_content

                # Debugging: print the extracted data to verify it's being parsed correctly
            print(extracted_data)  # Or use logging if preferred

            # Pass the extracted data to the display template
            return render(request, 'metadata_investigator/display_attributes.html', {'data': extracted_data})

        except ET.ParseError:
            return render(request, 'metadata_investigator/home.html', {'error': 'Invalid XML format.'})

            # If not a POST request or no file is uploaded, render the home page
    return render(request, 'metadata_investigator/home.html')




