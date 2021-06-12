import React, { Component } from 'react';
import Layout from '../../components/Layout.js';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => { //syntaxe pour les events. on ne peut pas faire la syntaxe habituelle des fctions sinon this sera faux
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });// pas besoin de spécifier les gas, metamask le fait pour nous. Gas seulement à specifier quand on fait des tests sur le contrat

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({loading: false});

  };

  render() {
    return (
      <Layout>
        <h1>Create a Campaign</h1>

        {/* error est une prop qui permet d'afficher le message error de semantic ui, sinon il n'apparait pas. le !! permet de transformer la valeur en booleen (le premier inverse et le deuxieme retablit le bon ordre)*/}
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event => this.setState({ minimumContribution: event.target.value})}/>
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
