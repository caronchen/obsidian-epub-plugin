import { WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";

export const EpubReader = ({ contents, title, scrolled, tocOffset, tocBottomOffset, leaf }: {
  contents: ArrayBuffer;
  title: string;
  scrolled: boolean;
  tocOffset: number;
  tocBottomOffset: number;
  leaf: WorkspaceLeaf;
}) => {
  const [location, setLocation] = useState(null);
  const renditionRef = useRef(null);
  const locationChanged = (epubcifi: string | number) => setLocation(epubcifi);

  useEffect(() => {
    leaf.view.app.workspace.on('resize', () => {
      const epubContainer = leaf.view.containerEl.querySelector('div.epub-container');
      if (epubContainer == null) {
        return;
      }
  
      const viewContentStyle = getComputedStyle(epubContainer.parentElement);
      renditionRef.current?.resize(parseFloat(viewContentStyle.width), parseFloat(viewContentStyle.height));
    })
  }, [leaf]);

  return <div style={{ height: "100vh" }}>
    <ReactReader
      title={title}
      showToc={true}
      location={location}
      locationChanged={locationChanged}
      swipeable={false}
      url={contents}
      getRendition={rendition => renditionRef.current = rendition}
      epubOptions={scrolled ? {
        allowPopups: true,
        flow: "scrolled",
        manager: "continuous",
      } : undefined}
      readerStyles={
        {
          ...ReactReaderStyle,
          arrow: {
            ...ReactReaderStyle.arrow,
            boxShadow: 'none'
          },
          tocArea: {
            ...ReactReaderStyle.tocArea,
            top: tocOffset.toString() + 'px',
            bottom: tocBottomOffset.toString() + 'px',
            left: 'auto',
            backgroundColor: 'currentColor',
            height: 'auto',
            whiteSpace: 'unset',
          },
          tocButtonExpanded: {
            ...ReactReaderStyle.tocButtonExpanded,
            backgroundColor: 'currentColor',
          }
        }
      }
    />
  </div>;
}