import React, { Component } from "react";
import { Button, Form, Input, Label, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class NewCampaignPage extends Component {
  state = {
    minimumContribution: 0,
    error: '',
    loading: 0,
  };

  onNewCampaignSubmit = async (event) => {
    event.preventDefault();

    try {
      this.setState({
        loading: this.state.loading + 1,
        error: '',
      });
      const [account] = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution.toString())
        .send({
          from: account,
        });
    } catch (e) {
        console.log(1)
      this.setState({
        error: e.message,
      });
    }
    this.setState({
        loading: this.state.loading > 0 ? this.state.loading - 1 : 0,
    })
  };

  render() {
    console.log(this.state.error)
    return (
      <Layout>
        {!this.state.error || <Message error header="Oops!" content={this.state.error}/>}
        <h1>Create a campaign</h1>
        <Form onSubmit={this.onNewCampaignSubmit} error={!!this.state.error}>
          <Form.Field>
            <Label>Minimum Contribution</Label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({
                  minimumContribution: Number.isNaN(+event.target.value)
                    ? this.state.minimumContribution
                    : +event.target.value,
                })
              }
            />
          </Form.Field>
          <Button loading={this.state.loading > 0} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default NewCampaignPage;
