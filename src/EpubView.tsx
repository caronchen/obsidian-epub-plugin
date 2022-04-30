import { WorkspaceLeaf, FileView, TFile } from "obsidian";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EpubPluginSettings } from "./EpubPluginSettings";
import { EpubReader } from "./EpubReader";

export const EPUB_FILE_EXTENSION = "epub";
export const VIEW_TYPE_EPUB = "epub";
export const ICON_EPUB = "doc-epub";

export class EpubView extends FileView {
  allowNoFile: false;

  constructor(leaf: WorkspaceLeaf, private settings: EpubPluginSettings) {
    super(leaf);
  }

  async onLoadFile(file: TFile): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.contentEl);
    this.contentEl.empty();
    const style = getComputedStyle(this.containerEl.parentElement.querySelector('div.view-header'));
    const width = parseFloat(style.width);
    const height = parseFloat(style.height);
    const tocOffset = height < width ? height : 0;

    this.app.vault.adapter.readBinary(file.path).then((contents) => {
      ReactDOM.render(
        <EpubReader
         contents={contents}
         title={file.basename}
         scrolled={this.settings.scrolledView}
         tocOffset={tocOffset}/>,
        this.contentEl
      );
    });
  }

  onunload(): void {
    ReactDOM.unmountComponentAtNode(this.contentEl);
  }

  getDisplayText() {
    if (this.file) {
      return this.file.basename;
    } else {
      return 'No File';
    }
  }

  canAcceptExtension(extension: string) {
    return extension == EPUB_FILE_EXTENSION;
  }

  getViewType() {
    return VIEW_TYPE_EPUB;
  }

  getIcon() {
    return ICON_EPUB;
  }
}
