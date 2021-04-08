"""
Find out the value for a specific key that is provided as an argument
in case keyName is not found - return error
in case keyName is found multiple times - return error
in case keyName is found once - return value
"""

import json

# VARIABLES
KEYS_WITH_SAME_NAME = 0
OUTPUT = ''
# Error variables
ERROR_FOUND = False
ERRORS = []

# HANDLERS
def handlers(arg: str) -> str:
  """Inputs parser and checker"""
  if arg:
    output = obj_format(arg.strip())
    return output
  nonlocal ERROR_FOUND, ERRORS
  ERROR_FOUND = True
  error_string = 'ERROR: No arg with key to search provided!'
  ERRORS.append(error_string)
  return ''


# FUNCTIONS LIST
def obj_format(obj: str) -> str:
  """Parse the object to determine file type among JSON, XML, or YAML."""
  value_to_check = ''
  if obj.startswith('{') or obj.startswith('['):
    value_to_check = json.loads(obj)['keyname']

  return value_to_check if value_to_check else obj


def find_object_keys(subset: dict, search_key: str) -> dict or None:
  """Recursive function to search value of specific key in subset defined."""
  for key in subset:
    if key == search_key:
      nonlocal KEYS_WITH_SAME_NAME, OUTPUT
      KEYS_WITH_SAME_NAME += 1
      OUTPUT = subset[key]
      if KEYS_WITH_SAME_NAME > 1:
        OUTPUT = "ERROR: {} keys named '{}' found.".format(KEYS_WITH_SAME_NAME, search_key)
    elif isinstance(subset[key], dict):
      find_object_keys(subset[key], search_key)
  return OUTPUT


"""Call the function to find the KEYNAME and return the value."""
KEYNAME = handlers(arg)
if KEYNAME and cds[0] and not ERROR_FOUND:
  OUTPUT = find_object_keys(cds[0], KEYNAME)
  if KEYS_WITH_SAME_NAME == 0:
    OUTPUT = "ERROR: keyname '{}' not found.".format(KEYNAME)
  if OUTPUT:
    return {"result": OUTPUT}
elif ERRORS:
  errors_description = ', '.join(ERRORS)
  return {"description": errors_description, "result": ERROR_FOUND}