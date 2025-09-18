import React from 'react';

/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const FilesData = (props) => {
    const data = props.graphData.value;
    const urls = data.map(d => d["@microsoft.graph.downloadUrl"]);

    async function get(url) {
        const config: OfficeParserConfig = {
            newlineDelimiter: " ",  // Separate new lines with a space instead of the default \n.
            ignoreNotes: true       // Ignore notes while parsing presentation files like pptx or odp.
        }
        console.log(config);

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        console.log(response);
        console.log(arrayBuffer);
        //const result = await officeParser.parseOfficeAsync(arrayBuffer, config);
        //console.log(result);
        //console.log("\n\n\n\n\n\n");
        //return result;
    }

    const text = get(urls[0]);
    console.log(text);
    console.log("\n\n\n\n\n\n");


    return (
        <div id="files-div">
            <pre style={{textAlign: "left"}}>
                {JSON.stringify(text, null, 2) }
            </pre>
        </div>
    );
};
