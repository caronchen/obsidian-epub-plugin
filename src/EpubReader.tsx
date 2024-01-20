import { WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ReactReader, ReactReaderStyle, type IReactReaderStyle } from "react-reader";
import type { Contents, Rendition } from 'epubjs';

export const EpubReader = ({ contents, title, scrolled, tocOffset, tocBottomOffset, leaf }: {
  contents: ArrayBuffer;
  title: string;
  scrolled: boolean;
  tocOffset: number;
  tocBottomOffset: number;
  leaf: WorkspaceLeaf;
}) => {
  const [location, setLocation] = useState<string | number | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  type ITheme = 'light' | 'dark';

  const isDarkMode = document.body.classList.contains('theme-dark');

  const locationChanged = (epubcifi: string | number) => setLocation(epubcifi);

  const updateTheme = (rendition: Rendition, theme: ITheme) => {
    const themes = rendition.themes;
    if (theme === 'dark') {
      themes.override('color', '#fff');
      themes.override('background', '#000');
    } else {
      themes.override('color', '#000');
      themes.override('background', '#fff');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const epubContainer = leaf.view.containerEl.querySelector('div.epub-container');
      if (!epubContainer) return;

      const viewContentStyle = getComputedStyle(epubContainer.parentElement);
      renditionRef.current?.resize(
        parseFloat(viewContentStyle.width),
        parseFloat(viewContentStyle.height)
      );
    };

    leaf.view.app.workspace.on('resize', handleResize);

    return () => leaf.view.app.workspace.off('resize', handleResize);
  }, [leaf]);

  return (
    <div style={{ height: "100vh" }}>
      <ReactReader
        title={title}
        showToc={true}
        location={location}
        locationChanged={locationChanged}
        swipeable={false}
        url={contents}
        getRendition={rendition => {
          renditionRef.current = rendition;
          rendition.hooks.content.register((contents: Contents) => {
            const body = contents.window.document.querySelector('body');
            if (body) {
              body.oncontextmenu = () => false;
            }
          });
          if (isDarkMode) {
            updateTheme(rendition, 'dark');
          }
        }}
        epubOptions={scrolled ? {
          allowPopups: true,
          flow: "scrolled",
          manager: "continuous",
        } : undefined}
        readerStyles={isDarkMode ? darkReaderTheme : lightReaderTheme}
      />
    </div>
  );
};

const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
};

const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'white',
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: '#ccc',
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: '#000',
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: '#ccc',
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: '#111',
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: '#222',
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: '#fff',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: 'white',
  },
};
