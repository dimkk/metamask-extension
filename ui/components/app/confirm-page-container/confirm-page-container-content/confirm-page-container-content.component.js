import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tabs, Tab } from '../../../ui/tabs';
import Button from '../../../ui/button';
import ActionableMessage from '../../../ui/actionable-message/actionable-message';
import { PageContainerFooter } from '../../../ui/page-container';
import ErrorMessage from '../../../ui/error-message';
import { INSUFFICIENT_FUNDS_ERROR_KEY } from '../../../../helpers/constants/error-keys';
import Typography from '../../../ui/typography';
import { TYPOGRAPHY } from '../../../../helpers/constants/design-system';
import { TRANSACTION_TYPES } from '../../../../../shared/constants/transaction';

import { ConfirmPageContainerSummary, ConfirmPageContainerWarning } from '.';
import { initialState } from '../../../../ducks/send';
import { render } from '@testing-library/react';

import TransactionDetailItem from '../../transaction-detail-item/transaction-detail-item.component';

export default class ConfirmPageContainerContent extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.initial_state = {
      loading: false,
      immuna_response: null,
    };
    this.state = {
      ...this.initial_state,
    };
  }

  static propTypes = {
    action: PropTypes.string,
    dataComponent: PropTypes.node,
    dataHexComponent: PropTypes.node,
    detailsComponent: PropTypes.node,
    errorKey: PropTypes.string,
    errorMessage: PropTypes.string,
    hideSubtitle: PropTypes.bool,
    tokenAddress: PropTypes.string,
    nonce: PropTypes.string,
    subtitleComponent: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    titleComponent: PropTypes.node,
    warning: PropTypes.string,
    origin: PropTypes.string.isRequired,
    ethGasPriceWarning: PropTypes.string,
    // Footer
    onCancelAll: PropTypes.func,
    onCancel: PropTypes.func,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func,
    submitText: PropTypes.string,
    disabled: PropTypes.bool,
    unapprovedTxCount: PropTypes.number,
    rejectNText: PropTypes.string,
    hideTitle: PropTypes.bool,
    supportsEIP1559V2: PropTypes.bool,
    hasTopBorder: PropTypes.bool,
    currentTransaction: PropTypes.object,
    nativeCurrency: PropTypes.string,
    networkName: PropTypes.string,
    showBuyModal: PropTypes.func,
    toAddress: PropTypes.string,
    transactionType: PropTypes.string,
    isBuyableChain: PropTypes.bool,
  };

  renderContent() {
    const { detailsComponent, dataComponent } = this.props;

    if (detailsComponent && dataComponent) {
      return this.renderTabs();
    }
    return detailsComponent || dataComponent;
  }

  getImmunaData = async () => {
    const { data } = this.props;
    this.setState({ loading: true });
    console.log('getImmunaData');
    const response = await fetch('https://api.immuna.xyz/evaluateTransaction', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        sender_address: data.txParams.from,
        receiver_address: data.txParams.to,
        sent_value: data.txParams.value,
        tx_data: data.txParams.data,
      }), // body data type must match "Content-Type" header
    });
    const json = await response.json();
    this.setState({ loading: false, immuna_response: json });
    console.log(json);
  };
  componentDidMount() {
    this.getImmunaData();
  }

  renderTabs() {
    const { t } = this.context;
    const {
      detailsComponent,
      dataComponent,
      dataHexComponent,
      data,
    } = this.props;
    this.state.immuna_response &&
      console.log({
        c: this.state.immuna_response.transactionResult.contracts,
      });
    return (
      <Tabs>
        <Tab
          className="confirm-page-container-content__tab"
          name={t('details')}
        >
          {detailsComponent}
        </Tab>
        <Tab className="confirm-page-container-content__tab" name={t('data')}>
          {dataComponent}
        </Tab>
        {dataHexComponent && (
          <Tab
            className="confirm-page-container-content__tab"
            name={t('dataHex')}
          >
            {dataHexComponent}
          </Tab>
        )}
        <Tab className="confirm-page-container-content__tab" name={'Immuna'}>
          {this.state.loading && (
            <div className="transaction-detail-item">
              <h2>Loading...</h2>
              <div className="transaction-detail-item__row"></div>
            </div>
          )}
          {this.state.immuna_response &&
            this.state.immuna_response.transactionResult &&
            this.state.immuna_response.transactionResult.contracts &&
            this.state.immuna_response.transactionResult.contracts.map((r) => {
              return (
                <TransactionDetailItem
                  key={r.address}
                  detailTitle={
                    r.valueReceivedBySender
                      ? 'You will recieve'
                      : 'You will be taken'
                  }
                  detailText={` ${r.value} of ${r.symbol} by ${r.address}`}
                />
              );
            })}
          {this.state.immuna_response &&
            this.state.immuna_response.transactionResult &&
            this.state.immuna_response.transactionResult.error && (
              <TransactionDetailItem
                detailTitle={`Immuna Error`}
                detailText={JSON.stringify(
                  this.state.immuna_response.transactionResult.error,
                  null,
                  2,
                )}
              />
            )}
        </Tab>
      </Tabs>
    );
  }

  render() {
    const {
      action,
      errorKey,
      errorMessage,
      title,
      image,
      titleComponent,
      subtitleComponent,
      hideSubtitle,
      tokenAddress,
      nonce,
      detailsComponent,
      dataComponent,
      warning,
      onCancelAll,
      onCancel,
      cancelText,
      onSubmit,
      submitText,
      disabled,
      unapprovedTxCount,
      rejectNText,
      origin,
      ethGasPriceWarning,
      hideTitle,
      supportsEIP1559V2,
      hasTopBorder,
      currentTransaction,
      nativeCurrency,
      networkName,
      showBuyModal,
      toAddress,
      transactionType,
      isBuyableChain,
    } = this.props;

    const { t } = this.context;

    const showInsuffienctFundsError =
      supportsEIP1559V2 &&
      (errorKey || errorMessage) &&
      errorKey === INSUFFICIENT_FUNDS_ERROR_KEY;

    return (
      <div
        className={classnames('confirm-page-container-content', {
          'confirm-page-container-content--with-top-border': hasTopBorder,
        })}
      >
        {warning ? <ConfirmPageContainerWarning warning={warning} /> : null}
        {ethGasPriceWarning && (
          <ConfirmPageContainerWarning warning={ethGasPriceWarning} />
        )}
        <ConfirmPageContainerSummary
          className={classnames({
            'confirm-page-container-summary--border':
              !detailsComponent || !dataComponent,
          })}
          action={action}
          title={title}
          image={image}
          titleComponent={titleComponent}
          subtitleComponent={subtitleComponent}
          hideSubtitle={hideSubtitle}
          tokenAddress={tokenAddress}
          nonce={nonce}
          origin={origin}
          hideTitle={hideTitle}
          toAddress={toAddress}
          transactionType={transactionType}
        />
        {this.renderContent()}
        {!supportsEIP1559V2 &&
          (errorKey || errorMessage) &&
          currentTransaction.type !== TRANSACTION_TYPES.SIMPLE_SEND && (
            <div className="confirm-page-container-content__error-container">
              <ErrorMessage errorMessage={errorMessage} errorKey={errorKey} />
            </div>
          )}
        {showInsuffienctFundsError && (
          <div className="confirm-page-container-content__error-container">
            <ActionableMessage
              className="actionable-message--warning"
              message={
                isBuyableChain ? (
                  <Typography variant={TYPOGRAPHY.H7} align="left">
                    {t('insufficientCurrencyBuyOrDeposit', [
                      nativeCurrency,
                      networkName,

                      <Button
                        type="inline"
                        className="confirm-page-container-content__link"
                        onClick={showBuyModal}
                        key={`${nativeCurrency}-buy-button`}
                      >
                        {t('buyAsset', [nativeCurrency])}
                      </Button>,
                    ])}
                  </Typography>
                ) : (
                  <Typography variant={TYPOGRAPHY.H7} align="left">
                    {t('insufficientCurrencyDeposit', [
                      nativeCurrency,
                      networkName,
                    ])}
                  </Typography>
                )
              }
              useIcon
              iconFillColor="var(--color-error-default)"
              type="danger"
            />
          </div>
        )}

        <PageContainerFooter
          onCancel={onCancel}
          cancelText={cancelText}
          onSubmit={onSubmit}
          submitText={submitText}
          disabled={disabled}
        >
          {unapprovedTxCount > 1 ? (
            <a onClick={onCancelAll}>{rejectNText}</a>
          ) : null}
        </PageContainerFooter>
      </div>
    );
  }
}
