import Ember from 'ember';
import layout from '../templates/components/trumbowyg-editor';

export default Ember.Component.extend({
  layout,
  tagName: 'textarea',
  html: null,
  placeholder: null,
  disabled: null,
  change: null,

  optionNames: [
    'prefix',
    'lang',
    'btns',
    'semantic',
    'resetCss',
    'removeformatPasted',
    'autogrow'
  ],

  _updateDisabled(){
    if (typeof this.get("disabled") === "boolean") {
      this.$().trumbowyg(this.get('disabled') ? 'disable' : 'enable');
    }
  },

  _renderTrumbowyg(){
    const options = this.get('optionNames')
      .filter(optionName => this.get(optionName) !== undefined )
      .reduce((options, optionName) => {
        options[optionName] = this.get(optionName);
        return options;
      }, {});

    this.$().attr("placeholder", this.get("placeholder"));
    this.$().trumbowyg(options);
    this.$().trumbowyg('html', this.get('html'));
    this._updateDisabled();

    this.$().on('tbwchange', () => {
      if (this.get('change')) {
        this.get('change')(this.$().trumbowyg('html'));
      }
    });
  },

  _destroyTrumbowyg(){
    this.$().off('tbwchange');
    this.$().trumbowyg('destroy');
  },

  _isAttrChanged(attrName){
    return this.get(attrName) !== this.get(`_oldOptions.${attrName}`);
  },

  didInsertElement(){
    this._renderTrumbowyg();
  },

  didUpdateAttrs() {
    const options = this.getProperties(this.get('optionNames').concat(['disabled', 'placeholder']));

    const optionsUpdated = this.get('optionNames').some(optionName => this._isAttrChanged(optionName));

    const htmlUpdated = this.get('html') !== this.$().trumbowyg('html');
    const disabledUpdated = this._isAttrChanged('disabled');
    const placeholderUpdated = this._isAttrChanged('placeholder');

    if (optionsUpdated || placeholderUpdated) {
      this._destroyTrumbowyg();
      this._renderTrumbowyg();
    }

    if (htmlUpdated) {
      this.$().trumbowyg('html', this.get('html'));
    }

    if (disabledUpdated) {
      this._updateDisabled();
    }

    this.set('_oldOptions', options);
  },

  willDestroyElement(){
    this._destroyTrumbowyg();
  }
});
