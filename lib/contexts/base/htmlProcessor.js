

module.exports = ({
  ignoredScriptTags,
  cutCutedScriptTags,
  optimize,
  expandRawHtmlBlocks,
  cutNewRelicScriptTags,
  cutNgTemplateScriptTags
}) => {

  return {

    prepare(html) {
      html = ignoredScriptTags.collapse(html);
      html = cutNewRelicScriptTags(html);

      return html;
    },

    perform(html) {
      html = ignoredScriptTags.expand(html);
      html = cutCutedScriptTags(html);
      html = cutNgTemplateScriptTags(html);
      html = expandRawHtmlBlocks(html);
      html = optimize(html);

      return html;
    }

  }

};
