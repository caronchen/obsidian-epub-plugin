import * as React from "react";
import { useState } from "react";
import {
  ReactReader,
  ReactReaderStyle
} from "react-reader";

export const EpubReader = ({ contents, title, scrolled }: {
  contents: ArrayBuffer;
  title: string;
  scrolled: boolean;
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
            top: 20,
            bottom: 20,
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