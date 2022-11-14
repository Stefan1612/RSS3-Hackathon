import "./App.css";

import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
//Components

import Home from "./Components/Home";
import MintedTokens from "./Components/MintedTokens";
import MintForm from "./Components/MintForm";
import OwnNfts from "./Components/OwnNfts";
import Header from "./Components/Header";
import Transfers from "./Components/Transfers";
import CrossChainTransfer from "./Components/CrossChainTransfer";
import Wallet from "./Components/Wallet";

//abi's

import NFT from "./config/contracts/NFT.json";
import NftMarketPlace from "./config/contracts/NftMarketPlace.json";
import ContractAddress from "./config/contracts/map.json";
//others
import { ethers } from "ethers";
import axios from "axios";
/* import { create as ipfsHttpClient } from "ipfs-http-client"; */
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

import "bootstrap/dist/css/bootstrap.min.css";

import theme from "./Components/theme/theme";

// const {utils, BigNumber} = require('ethers');

function App() {
  //contract addresses

  //handle State
  const [account, setAccount] = useState("");
  // const [nfts, setNfts] = useState([]);

  //provider and signer
  let provider;

  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  let signer;
  if (window.ethereum) {
    signer = provider.getSigner();
  }

  // infuraProvider

  const infuraProvider = new ethers.providers.InfuraProvider("goerli", {
    projectId: process.env.REACT_APP_PROJECT_ID,
    projectSecret: process.env.REACT_APP_PROJECT_SECRET,
  });

  //market
  const eventContractMarket = new ethers.Contract(
    ContractAddress[5].NftMarketPlace,
    NftMarketPlace.abi,
    provider
  );
  //nft
  const eventContractNFT = new ethers.Contract(
    ContractAddress[5].NFT,
    NFT.abi,
    provider
  );
  const eventContractMarketInfura = new ethers.Contract(
    ContractAddress[5].NftMarketPlace,
    NftMarketPlace.abi,
    infuraProvider
  );
  const eventContractNFTInfura = new ethers.Contract(
    ContractAddress[5].NFT,
    NFT.abi,
    infuraProvider
  );
  //signer calls
  //market
  const signerContractMarket = new ethers.Contract(
    ContractAddress[5].NftMarketPlace,
    NftMarketPlace.abi,
    signer
  );
  //NFT

  //side loaded
  useEffect(() => {
    loadOnSaleNFTs();

    if (provider) {
      FirstLoadGettingAccount(); // user provider
      gettingNetworkNameChainId(); // user provider
      /*  loadAll(); */
      loadOwnNFTs(); // user provider
      loadMintedNFTs(); // user provider
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //side loaded
  async function FirstLoadGettingAccount() {
    if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert("Install Metamask!");
    }
  }

  //on chain change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  //on account change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      window.location.reload();
    }
  }
  //network
  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });
  async function gettingNetworkNameChainId() {
    const network = await provider.getNetwork();
    setNetwork(network);
  }

  const [ownNFTs, setOwnNFTs] = useState([]);

  async function loadOwnNFTs() {
    let data = await signerContractMarket.fetchAllMyTokens();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        //change the format to something im familiar with
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setOwnNFTs(tokenData);
  }

  const [onSaleNFTs, setOnSaleNFTs] = useState([]);

  async function loadOnSaleNFTs() {
    let data = await eventContractMarketInfura.fetchAllTokensOnSale();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFTInfura.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setOnSaleNFTs(tokenData);
  }

  const [mintedNFTs, setMintedNFTs] = useState([]);

  async function loadMintedNFTs() {
    let data = await signerContractMarket.fetchTokensMintedByCaller();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setMintedNFTs(tokenData);
  }

  //uint256 _tokenId, address _nftContractAddress, value
  async function buyNFT(marketItem) {
    let id = marketItem.tokenId;
    id = id.toNumber();
    let price = marketItem.price;
    price = ethers.utils.parseEther(price);

    /// -----------------------------------------------------------------------------
    let tx = await signerContractMarket.buyMarketToken(
      id,
      ContractAddress[5].NFT,
      {
        value: price,
      }
    );
    await tx.wait();
    loadOwnNFTs();
    loadOnSaleNFTs();
  }

  async function sellNFT(marketItem) {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[5].NftMarketPlace,
      NftMarketPlace.abi,
      signer
    );
    const nftContract = new ethers.Contract(
      ContractAddress[5].NFT,
      NFT.abi,
      signer
    );
    let id = marketItem.tokenId;
    id = id.toNumber();
    await nftContract.setApprovalForAll(
      ContractAddress[5].NftMarketPlace,
      true
    );

    /// -----------------------------------------------------------------------------
    let tx = await contract.saleMarketToken(
      id,
      previewPriceTwo,
      ContractAddress[5].NFT
    );
    await tx.wait();
    loadOwnNFTs();
    loadOnSaleNFTs();
  }

  const [previewPriceTwo, setPreviewPriceTwo] = useState({});

  let previewPrice = 0;

  //BUG when using input field and using a nft button on a completely different nft its still submitting the input price
  //changing price from ether(user Input) into wei for contract
  const handleChangePrice = (e) => {
    previewPrice = e.target.value;
    // you need to use dots instead of commas when using ether instead of wei
    previewPrice = previewPrice.toString();
    previewPrice = ethers.utils.parseEther(previewPrice);
    setPreviewPriceTwo(previewPrice);
    /* console.log(previewPriceTwo); */
  };

  //client used to host and upload data, endpoint infura

  const projectId = process.env.REACT_APP_PORJECT_ID_IPFS; // <---------- your Infura Project ID

  const projectSecret = process.env.REACT_APP_PORJECT_SECRET_IPFS; // <---------- your Infura Secret

  const projectIdAndSecret = `${projectId}:${projectSecret}`;

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
        "base64"
      )}`,
    },
  });

  //keeping track of URL inserted as image for NFT metadata
  const [fileURL, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({ name: "", description: "" });

  async function handleUrlChange(e) {
    //check e.target.files without target [0]
    // console.log(e.target.files)
    const file = e.target.files[0];
    // console.log(file)
    try {
      const added = await client.add(
        file
        /*, {
                    progress: (prog) => console.log(`received ${prog}`)
                }*/
      );

      //added is an object containing the path(hash), CID, and the size of the file
      //console.log(added)
      const url = `https://biconomynft.infura-ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setFileURL(url);
      // console.log(url)
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  async function createMarket() {
    if (!formInput.name || !formInput.description || !fileURL) {
      return;
    }
    //upload to IPFS but this time with metadata
    //the metadata comes from a json, we need to stringify the data to upload it
    const data = JSON.stringify({
      name: formInput.name,
      description: formInput.description,
      image: fileURL,
    });

    try {
      const added = await client.add(data);
      const url = `https://biconomynft.infura-ipfs.io/ipfs/${added.path}`;
      //run a function that creates Sale and passes in the URL
      mintNFT(url);
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  //creating the NFT(first mint at ContractAddress[5].NftMarketPlace, second create market Token at market address)
  async function mintNFT(url) {
    //first step
    const signer1 = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[5].NFT,
      NFT.abi,
      signer1
    );

    await contract.createNFT(url);

    //list the item for sale on marketplace
    let listingPrice = await eventContractMarket.getListingPrice();
    listingPrice = listingPrice.toString();

    // tx without gasless (user needs to pay for tx)
    let transaction = await signerContractMarket.mintMarketToken(
      ContractAddress[5].NFT,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
  }
  const [transferHistory, setTransferHistory] = useState("");
  async function getCovalentData() {
    const url =
      /* new URL( */
      `https://api.covalenthq.com/v1/42/address/${account}/transfers_v2/?contract-address=${ContractAddress[5].NFT}&key=${process.env.REACT_APP_COVALENT_API_KEY}`;

    /*   ); */

    await setTransferHistory(await axios.get(url));
  }

  function changeFormInputDescription(e) {
    setFormInput({ ...formInput, description: e.target.value });
  }
  function changeFormInputName(e) {
    setFormInput({ ...formInput, name: e.target.value });
  }

  //////////////////////////////

  // RSS3

  // test address: 0x5a9D901146DCf8d1CCf5BB2ABD24437DE533c8d5

  // eslint-disable-next-line
  const [inputValue, setInputValue] = useState("");
  const [normalTXHistory, setNormalTXHistory] = useState("");
  const [internalTXHistory, setInternalTXHistory] = useState("");
  const [isFetchedTX, setIsFetchedTX] = useState(false);
  const [num, setNum] = useState(0);
  const [address, setAddress] = useState("");
  /* const [isFetchingAccountTxHistory, setIsFetchingAccountTxHistory] =
    useState(true); */

  function addNum() {
    setNum((previousNum) => previousNum + 5);
    console.log(num);
    getTXHistory();
  }
  function changeInput(e) {
    /* setIsFetchingAccountTxHistory(false); */
    setInputValue(e.target.value);
    setAddress(e.target.value);
  }
  async function getAccountTXHistory() {
    if (normalTXHistory !== "") {
      setNormalTXHistory("");
    }

    if (account !== "") {
      console.log("address was defined");
      setNormalTXHistory("");
      setInternalTXHistory("");

      setSecondAlchemyResult("");
      try {
        console.log("axios call now starts");
        let res = await axios.get(
          `https://pregod.rss3.dev/v1/notes/${account}?limit=${
            10 + num
          }&include_poap=false&count_only=false&query_status=false`
        );
        setNormalTXHistory(res);
        if (res !== undefined) {
          setIsFetchedTX(true);
        }
      } catch {
        console.log("rss3 api call ended up failing");
      }
    }
  }

  async function getTXHistory() {
    if (normalTXHistory !== "") {
      setNormalTXHistory("");
    }

    if (address !== "") {
      console.log("address was defined");
      setNormalTXHistory("");
      setInternalTXHistory("");

      setSecondAlchemyResult("");

      try {
        let res = await axios.get(
          `https://pregod.rss3.dev/v1/notes/${address}?limit=${
            10 + num
          }&include_poap=false&count_only=false&query_status=false`
        );
        setNormalTXHistory(res);
        if (res !== undefined) {
          setIsFetchedTX(true);
        }
      } catch {
        console.log("rss3 api call ended up failing");
      }
    }
  }
  useEffect(() => {
    console.log("useffect activated");
    if (appInitiated) {
      console.log("b");
      getTXHistory();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  /*eslint-disable */
  const [isFetched, setIsFetched] = useState(false);
  const [secondAlchemyResult, setSecondAlchemyResult] = useState("");
  const [appInitiated, setAppInitiated] = useState(false);
  /*eslint-enable */
  //////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                account={account}
                networkChainId={network.chainId}
                networkName={network.name}
                handleUrlChange={handleUrlChange}
                mintNFT={mintNFT}
                /* nfts={nfts} */
                onSaleNFTs={onSaleNFTs}
                buyNFT={buyNFT}
                FirstLoadGettingAccount={FirstLoadGettingAccount}
                getCovalentData={getCovalentData}
              />
            }
          />
          <Route
            exact
            path="/MintForm"
            element={
              <MintForm
                setFormInput={setFormInput}
                formInput={formInput}
                onChange={handleUrlChange}
                changeFormInputDescription={changeFormInputDescription}
                changeFormInputName={changeFormInputName}
                fileURL={fileURL}
                createMarket={createMarket}
              />
            }
          />

          <Route
            exact
            path="/OwnNfts"
            element={
              <OwnNfts
                ownNFTs={ownNFTs}
                sellNFT={sellNFT}
                handleChangePrice={handleChangePrice}
              />
            }
          />

          <Route
            exact
            path="/MintedTokens"
            element={<MintedTokens mintedNFTs={mintedNFTs} />}
          />
          <Route
            exact
            path="/TransferHistory"
            element={
              <Transfers
                account={account}
                getCovalentData={getCovalentData}
                transferHistory={transferHistory}
                infuraProvider={infuraProvider}
              />
            }
          />
          <Route
            exact
            path="/CrossChainTransfer"
            element={<CrossChainTransfer />}
          />
          <Route
            exact
            path="/Wallet"
            element={
              <Wallet
                changeInput={changeInput}
                getTXHistory={getTXHistory}
                isFetched={isFetched}
                normalTXHistory={normalTXHistory}
                isFetchedTX={isFetchedTX}
                internalTXHistory={internalTXHistory}
                secondAlchemyResult={secondAlchemyResult}
                addNum={addNum}
                account={account}
                networkChainId={network.chainId}
                networkName={network.name}
                getAccountTXHistory={getAccountTXHistory}
              />
            }
          />
        </Routes>
        <Box></Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
