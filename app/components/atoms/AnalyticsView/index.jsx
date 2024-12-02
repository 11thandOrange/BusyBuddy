import React, { useState } from 'react';
import { Card, Icon, TextContainer } from '@shopify/polaris';
import { ChartPopularIcon } from '@shopify/polaris-icons';
import ChartRenderer from '../ChartRenderer';
import './style.css'
import IMAGES from '../../../utils/Images';

const basicOptions = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Analytics',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Dates',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Count',
      },
    },
  },
}
function AnalyticsView({handleSelectTab, selectedTabs, tabs, chartData, data, chartRef}) {

    return (
      <Card sectioned>
        <div className='tabsContainer'>
          {tabs.map((tab) => {
            const currentTab = data?.find(item => item.activityId == tab.key)
            return <div
              key={tab.key}
              onClick={() => handleSelectTab(tab.key)}
              className={`tab ${selectedTabs.includes(tab.key) ? 'tabSelected' : ''}`}
              style={{
                backgroundColor: selectedTabs.includes(tab.key) ? tab.color : undefined,
              }}
            >
              <TextContainer>
                <h3 className="tabLabel">{tab.label}</h3>
                <p className='tabValue'>{currentTab?.totalCount}</p>
                {currentTab?.changePercentage ? <p className='tabDescription'><img src={currentTab?.hasIncreased ? IMAGES.UpArrowWhite : IMAGES.DownArrowWhite}/> {currentTab?.changePercentage}%</p> : ""}
              </TextContainer>
            </div>
          }
          )}
        </div>

        <span><ChartRenderer chartRef={chartRef} data={chartData} basicOptions={basicOptions}/></span>
  
        <div className='footer' style={!chartData.labels.length ? {display: 'unset'} : {display: 'none'}}>
          <Icon
            source={ChartPopularIcon}
            tone="base"
          />
          <TextContainer>
            <p>Your analytics will be displayed here</p>
            <p>No data available yet.</p>
          </TextContainer>
        </div>
      </Card>
    );
}

export default AnalyticsView;
