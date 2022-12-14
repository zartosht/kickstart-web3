import React, { Component } from "react";
import factory from "../ethereum/factory";
import { Button, Card } from "semantic-ui-react";
import Layout from "../components/Layout";

class IndexPage extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((campaign) => ({
      header: campaign,
      description: <a>View Campaign</a>,
      fluid: true,
    }));
    return <Card.Group items={items}/>
  }

  render() {
    return (
      <Layout>
        <div>

        </div>
        <h3>Open Campaigns</h3>
        <Button
        content="Create Campaign"
        icon="add circle"
        floated="right"
        primary
        />
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default IndexPage;
