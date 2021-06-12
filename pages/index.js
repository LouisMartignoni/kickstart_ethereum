import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
  // componentDidMount permet d'executer au moment du rendering. Ici next.js compile l'app sur le server avant d'envoyer l'html au browser.
  // Dans notre cas on veut pouvoir recuperer des infos de la blockchain avant l'envoi sur le browser, cad pendant le next.js qui lui n'execute pas
  // componentDidMount; on doit donc utiliser une autre fonction: getInitialProps qui est specifique à next.js et qui est exec par next à l'init
  static async getInitialProps() { // static donc pas besoin d'instance, on peut direct appeler CampaignIndex.getInitialProps
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description:(
          <Link route={`/campaigns/${address}`}>
            <a >View Camapaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />; //semantic package
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Link route='/campaigns/new'>
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary // == primary={true}
              />
            </a>
          </Link>

          { this.renderCampaigns() }
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
