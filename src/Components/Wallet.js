import React from "react";
import { Box, Button, Input, Typography, Container } from "@mui/material";
import rss3 from "./assets/RSS3.png";

const Wallet = (props) => {
  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Container>
        {" "}
        <img alt="rss3 logo" className={"imageTwo"} src={rss3}></img>
        <Box
          sx={{
            color: "white",
            borderColor: "white",
            border: "solid",
            borderRadius: "20px",
            borderWidth: "1px",
            marginBottom: "2vh",
          }}
        >
          <Box sx={{ textAlign: "left", marginLeft: "10vw" }}>
            {" "}
            <Typography variant={"h1"} component={"h1"}>
              Wallet{" "}
            </Typography>
            <Typography>
              Currently connected address: {props.account}
            </Typography>
            <Typography>
              {" "}
              Currently connected to the network: {props.networkName} ;{" "}
              {props.networkChainId}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant={"h3"}
              component={"h3"}
              sx={{ marginTop: "4vh" }}
            >
              Interested in loading your Tx history? (Ethereum mainnet)
            </Typography>{" "}
            <Typography>Click here (metamask needs to be connected)</Typography>
            <Button
              onClick={(e) => props.getAccountTXHistory()}
              variant="contained"
            >
              account history
            </Button>
          </Box>
          <Box
            sx={{ textAlign: "center", marginTop: "14vh", marginBottom: "2vh" }}
          >
            <Typography variant={"h3"} component={"h3"}>
              Interested in checking out other (not connected) addresses?
              (Ethereum mainnet)
            </Typography>
            <Typography>Generate here</Typography>
            <Input
              onChange={(e) => props.changeInput(e)}
              placeholder="Domain or address"
            ></Input>
            &nbsp;
            <Button onClick={(e) => props.getTXHistory()} variant="contained">
              address Tx history
            </Button>
          </Box>

          <Box></Box>
          <Box>
            {props.isFetchedTX && props.normalTXHistory !== "" && (
              <Box>
                {props.normalTXHistory !== "" && (
                  <Box>
                    <Box sx={{ border: "solid", borderColor: "white" }}></Box>
                    <Box
                      variant={"h2"}
                      component={"h3"}
                      sx={{ marginLeft: "3vw", marginTop: "3vh" }}
                    >
                      "Outgoing - transfer" Transaction History
                    </Box>
                    <Box
                      style={{
                        border: "solid",
                        margin: "10px",
                        padding: "10px",
                        borderWidth: "1px",
                      }}
                    >
                      {
                        /* props.normalTXHistory.data.result.length !== 0 &&
                    props.normalTXHistory.data.result[0] !== undefined && */
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
                                This is the {index + 1 + "th"} TX in your List{" "}
                                <img
                                  class="image floatRight"
                                  sx={{ textAlign: "right" }}
                                  src={
                                    props.normalTXHistory.data.result[index]
                                      .actions[0].metadata.image
                                  }
                                  alt="token"
                                ></img>
                              </Typography>
                              <Box>
                                Network =&gt;
                                {
                                  props.normalTXHistory.data.result[index]
                                    .network
                                }
                              </Box>
                              <Box>
                                Symbol =&gt;{" "}
                                {
                                  props.normalTXHistory.data.result[index]
                                    .actions[0].metadata.symbol
                                }{" "}
                              </Box>

                              <Box>
                                Name =&gt;{" "}
                                {
                                  props.normalTXHistory.data.result[index]
                                    .actions[0].metadata.name
                                }{" "}
                              </Box>
                              <Box>
                                Timestamp =&gt;
                                {
                                  props.normalTXHistory.data.result[index]
                                    .timestamp
                                }
                              </Box>
                              <Box>
                                From =&gt;{" "}
                                {
                                  props.normalTXHistory.data.result[index]
                                    .address_from
                                }
                              </Box>
                              <Box>
                                To =&gt;{" "}
                                {
                                  props.normalTXHistory.data.result[index]
                                    .address_to
                                }
                              </Box>
                              <Box>
                                Value token =&gt;{" "}
                                {
                                  props.normalTXHistory.data.result[index]
                                    .actions[0].metadata.value_display
                                }{" "}
                              </Box>
                              <Box>
                                Value send =&gt;{" "}
                                {
                                  props.normalTXHistory.data.result[index]
                                    .actions[0].metadata.value
                                }{" "}
                              </Box>

                              <Box>
                                Gas Used =&gt;{" "}
                                {props.normalTXHistory.data.result[index].fee}{" "}
                                in Wei
                              </Box>
                              {/* <Box>
                            Gas Price =&gt;
                            {props.normalTXHistory.data.result[index].gasPrice}
                          </Box> */}
                              <Box>
                                Hash of TX =&gt;{" "}
                                {props.normalTXHistory.data.result[index].hash}
                              </Box>

                              <Box>
                                Type =&gt;
                                {props.normalTXHistory.data.result[index].type}
                              </Box>

                              <br></br>
                            </Box>
                          );
                        })
                      }
                      <Button
                        variant={"contained"}
                        onClick={(e) => props.addNum(e)}
                      >
                        Load More
                      </Button>
                    </Box>{" "}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Wallet;
