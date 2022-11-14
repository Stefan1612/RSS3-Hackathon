import React from "react";
import { Box, Button, Input, Typography } from "@mui/material";

const Wallet = (props) => {
  return (
    <div>
      <Input
        onChange={(e) => props.changeInput(e)}
        placeholder="Domain or address"
      ></Input>
      &nbsp;
      <Button
        onClick={(e) => /* props.getAPIData()  */ props.getTXHistory()}
        variant="contained"
      >
        Get YOUR Data
      </Button>
      <Box></Box>
      <Box>
        {props.isFetchedTX && props.normalTXHistory !== "" && (
          <Box>
            <Box variant={"h2"} component={"h3"}>
              "Normal" Transaction History of address{" "}
            </Box>
            <Box
              style={{
                border: "solid",
                margin: "10px",
                padding: "10px",
                borderWidth: "1px",
              }}
            >
              {props.normalTXHistory.data.result.length !== 0 &&
                props.normalTXHistory.data.result[0] !== undefined &&
                props.normalTXHistory.data.result.map((e, index) => {
                  return (
                    <Box
                      key={index}
                      style={{
                        border: "solid",
                        margin: "10px",
                        padding: "10px",
                        borderWidth: "1px",
                        textAlign: "left",
                      }}
                    >
                      <Typography variant={"h6"} component={"h3"}>
                        This is the {index + 1 + "th"} TX in your List
                      </Typography>
                      <Box>
                        Value send =&gt;{" "}
                        {
                          props.normalTXHistory.data.result[index].actions[0]
                            .metadata.value
                        }{" "}
                        Wei
                      </Box>
                      <Box>
                        Symbol =&gt;{" "}
                        {
                          props.normalTXHistory.data.result[index].actions[0]
                            .metadata.symbol
                        }{" "}
                      </Box>
                      <Box>
                        Name =&gt;{" "}
                        {
                          props.normalTXHistory.data.result[index].actions[0]
                            .metadata.name
                        }{" "}
                      </Box>
                      <Box>
                        Value token =&gt;{" "}
                        {
                          props.normalTXHistory.data.result[index].actions[0]
                            .metadata.value_display
                        }{" "}
                      </Box>
                      <Box>
                        From =&gt;{" "}
                        {props.normalTXHistory.data.result[index].address_from}
                      </Box>
                      <Box>
                        To =&gt;{" "}
                        {props.normalTXHistory.data.result[index].address_to}
                      </Box>
                      <Box>
                        Gas Used =&gt;{" "}
                        {props.normalTXHistory.data.result[index].fee}
                      </Box>
                      <Box>
                        Gas Price =&gt;
                        {props.normalTXHistory.data.result[index].gasPrice}
                      </Box>
                      <Box>
                        Hash of TX =&gt;{" "}
                        {props.normalTXHistory.data.result[index].hash}
                      </Box>

                      <Box>
                        Time of tx =&gt;
                        {props.normalTXHistory.data.result[index].timestamp}
                      </Box>
                      <Box>
                        Type =&gt;
                        {props.normalTXHistory.data.result[index].type}
                      </Box>
                      <Box>
                        Network =&gt;
                        {props.normalTXHistory.data.result[index].network}
                      </Box>

                      <br></br>
                    </Box>
                  );
                })}
              <Button variant={"contained"} onClick={(e) => props.addNum(e)}>
                Load More
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Wallet;
