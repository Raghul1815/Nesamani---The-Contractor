'use strict';

const createPlugin = (
  plugin,
  config
) => {
  return {
    handler: plugin,
    config,
  };
};

createPlugin.withOptions = function(
  pluginFunction,
  configFunction = () => ({}),
) {
  const optionsFunction = function (options= {} ) {
    return {
      __options: options,
      handler: pluginFunction(options),
      config: configFunction(options),
    };
  };

  optionsFunction.__isOptionsFunction = true ;

  // Expose plugin dependencies so that `object-hash` returns a different
  // value if anything here changes, to ensure a rebuild is triggered.
  optionsFunction.__pluginFunction = pluginFunction;
  optionsFunction.__configFunction = configFunction;

  return optionsFunction;
};

var index = createPlugin(
  function ({ addDynamic, theme }) {

    addDynamic('line-clamp', ({ Utility, Property, Style }) => {
      if (Utility.amount === 'none') return Style(Utility.class, Property('-webkit-line-clamp', 'unset'));
      const value = Utility.handler.handleStatic(theme('lineClamp')).handleNumber(1, undefined, 'int').value;
      if (value) {
        return Style.generate(Utility.class, {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': value,
        });
      }
    }, {
      group: 'lineClamp',
      completions: [
        'line-clamp-none',
        'line-clamp-{int}',
      ],
    });
  },
  {
    theme: {
      lineClamp: {
      },
    },
    variants: {
      lineClamp: ['responsive'],
    },
  }
);

module.exports = index;
