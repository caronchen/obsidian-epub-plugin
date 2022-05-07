import * as React from "react";
import { useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";

export const EpubReader = ({ contents, title, scrolled, tocOffset }: {
  contents: ArrayBuffer;
  title: string;
  scrolled: boolean;
  tocOffset: number;
}) => {
  const [location, setLocation] = useState(null);
  const locationChanged = (epubcifi: string | number) => setLocation(epubcifi);

  return <div style={{ height: "100vh" }}>
    <ReactReader
      title={title}
      showToc={true}
      location={location}
      locationChanged={locationChanged}
      swipeable={false}
      url={contents}
      epubOptions={scrolled ? {
        flow: "scrolled",
        manager: "continuous"
      } : {}}
      styles={
        {
          ...ReactReaderStyle,
          tocArea: {
            ...ReactReaderStyle.tocArea,
            top: (tocOffset + 20).toString() + 'px',
            bottom: "20px",
            left: 'auto',
            backgroundColor: 'currentColor',
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