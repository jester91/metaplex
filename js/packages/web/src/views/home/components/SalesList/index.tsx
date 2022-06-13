import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import React, { useMemo, useState } from 'react';

import { useMeta } from '../../../../contexts';
import { CardLoader } from '../../../../components/MyLoader';
import { Banner } from '../../../../components/Banner';
import { HowToBuyModal } from '../../../../components/HowToBuyModal';

import { useAuctionsList } from './hooks/useAuctionsList';
import { AuctionRenderCard } from '../../../../components/AuctionRenderCard';

const { TabPane } = Tabs;
const { Content } = Layout;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
  Own = '4',
}

export const SalesListView = (props: { collectionMintFilter?: string }) => {
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected } = useWallet();
  const { auctions, hasResaleAuctions } = useAuctionsList(activeKey);

  const filteredAuctions = useMemo(() => {
    if (props.collectionMintFilter) {
      return auctions.filter(
        auction =>
          auction.thumbnail.metadata.info.collection?.key ===
          props.collectionMintFilter,
      );
    }
    return auctions;
  }, [auctions, props.collectionMintFilter]);

  return (
    <>
      {!props.collectionMintFilter && (
        <Banner
          src="https://ams02pap001files.storage.live.com/y4m_9fv1OTpuagKg4HSI7twgxynBCXtfYb_vOHb1tDC8STHhTSKcY8Fx0qC0q5wXrUH74elRNNAj1XyzXtsfxTQ3SC1wsBnCfWLva87L2i9P6DdHVu9kwjg-7_QTYEj1kcGGkE6ainaLnsIybsyV0hB0CYtBOaQB7Tais3AEapaOHQZI8gpIVrOnNi-_SnX8ipzDwy5wnaada87HCgiIRofJQ/hero-medium-min.png?psid=1&width=1056&height=400"
          headingText="OWN A PIECE FROM CRYPTO HISTORY."
          subHeadingText="Buy exclusive CryptoMemories NFTs."
          actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
          useBannerBg
        />
      )}
      <Layout>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 32 }}>
            <Row>
              <Tabs
                activeKey={activeKey}
                onTabClick={key => setActiveKey(key as LiveAuctionViewState)}
              >
                <TabPane
                  tab={
                    <>
                      <span className="live"></span> Live
                    </>
                  }
                  key={LiveAuctionViewState.All}
                ></TabPane>
                {hasResaleAuctions && (
                  <TabPane
                    tab="Secondary Marketplace"
                    key={LiveAuctionViewState.Resale}
                  ></TabPane>
                )}
                <TabPane tab="Ended" key={LiveAuctionViewState.Ended}></TabPane>
                {connected && (
                  <TabPane
                    tab="Participated"
                    key={LiveAuctionViewState.Participated}
                  ></TabPane>
                )}
                {connected && (
                  <TabPane
                    tab="My Live Auctions"
                    key={LiveAuctionViewState.Own}
                  ></TabPane>
                )}
              </Tabs>
            </Row>
            <Row>
              <div className="artwork-grid">
                {isLoading &&
                  [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
                {!isLoading &&
                  filteredAuctions.map(auction => (
                    <Link
                      key={auction.auction.pubkey}
                      to={`/auction/${auction.auction.pubkey}`}
                    >
                      <AuctionRenderCard auctionView={auction} />
                    </Link>
                  ))}
              </div>
            </Row>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
