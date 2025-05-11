// utils/parseOptions.js
export function parseOptionsToRelationalInput(options) {
    return options.map((option) => ({
      value: option.id,
      label: option.name,
    }));
  }
  