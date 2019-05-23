import { Pipeline, RawAssertions, Step, Log, Keyboard, Keys, FocusTools } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyLoader } from '@ephox/mcagar';

import Settings from 'tinymce/plugins/spellchecker/api/Settings';
import SpellcheckerPlugin from 'tinymce/plugins/spellchecker/Plugin';
import SilverTheme from 'tinymce/themes/silver/Theme';
import { document } from '@ephox/dom-globals';
import { Element } from '@ephox/sugar';
import Tools from '../../../../../core/main/ts/api/util/Tools';

UnitTest.asynctest('browser.tinymce.plugins.spellchecker.SpellcheckerTest', function () {
  const success = arguments[arguments.length - 2];
  const failure = arguments[arguments.length - 1];

  SilverTheme();
  SpellcheckerPlugin();

  const sTestDefaultLanguage = function (editor) {
    return Step.sync(function () {
      RawAssertions.assertEq('should be same', Settings.getLanguage(editor), 'en');
    });
  };

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const doc = Element.fromDom(document);

    const sPressTab = Keyboard.sKeydown(doc, Keys.tab(), {});
    const sPressEsc = Keyboard.sKeydown(doc, Keys.escape(), {});
    const sPressDown = Keyboard.sKeydown(doc, Keys.down(), {});
    const sPressRight = Keyboard.sKeydown(doc, Keys.right(), {});

    const sFocusToolbar = Step.sync(() => {
      const args = Tools.extend({
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
      }, {altKey: true, keyCode: 120});
      editor.fire('keydown', args);
    });

    const sAssertFocused = (name, selector) => {
      return FocusTools.sTryOnSelector(name, doc, selector);
    };

    Pipeline.async({}, Log.steps('TBA', 'Spellchecker: Reaching the spellchecker via the keyboard', [
      sTestDefaultLanguage(editor),
      sFocusToolbar,
      sAssertFocused('File', '.tox-mbtn:contains("File")'),
      sPressRight,
      sAssertFocused('Edit', '.tox-mbtn:contains("Edit")'),
      sPressRight,
      sAssertFocused('View', '.tox-mbtn:contains("View")'),
      sPressRight,
      sAssertFocused('Format', '.tox-mbtn:contains("Format")'),
      sPressRight,
      sAssertFocused('Tools', '.tox-mbtn:contains("Tools")'),
      sPressDown,
      sAssertFocused('Spellcheck tool menu item', '.tox-collection__item:contains("Spellcheck")'), // Menu item can be reached by keyboard
      sPressEsc,
      sPressTab,
      sAssertFocused('Spellchecker button', '.tox-split-button'), // Button can be reached by keyboard
      sPressDown,
      sAssertFocused('First language', '.tox-collection__item:contains("English")'), // Languages can be reached by keyboard
    ]), onSuccess, onFailure);
  }, {
    theme: 'silver',
    plugins: 'spellchecker',
    toolbar: 'spellchecker',
    base_url: '/project/tinymce/js/tinymce',
    spellchecker_callback (method, text, success, failure) {
      if (method === 'spellcheck') {
        success({words: {
          helo: ['hello'],
          worl: ['world']
        }});
      }
    },
  }, success, failure);
});