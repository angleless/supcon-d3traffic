import React, { Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import './index.less'

class InnerAddDirections extends Component {
    state={
      showModals: false,
      showText: '',
      directionList: [[{
        name: 'STRAIGHT',
        func: 'straightSvg'
      }, {
        name: 'LEFT',
        func: 'leftSvg'
      }, {
        name: 'BACK',
        func: 'backSvg'
      }, {
        name: 'RIGHT',
        func: 'rightSvg'
      }], [{
        name: 'STRAIGHT_RIGHT',
        func: 'straightRightSvg'
      }, {
        name: 'LEFT_STRAIGHT',
        func: 'straightLeft'
      }, {
        name: 'STRAIGHT_BACK',
        func: 'backStraight'
      }, {
        name: 'LEFT_BACK',
        func: 'backLeft'
      }], [{
        name: 'LEFT_RIGHT',
        func: 'leftRightSvg'
      }, {
        name: 'LEFT_STRAIGHT_RIGHT',
        func: 'leftRightStraightFunc'
      }, {
        name: 'LEFT_STRAIGHT_RIGHT_BACK',
        func: 'leftStrightRogthBackSvg'
      }, {
        name: 'STRAIGHT_RIGHT_BACK',
        func: 'straightRightBackSvg'
      }], [{
        name: 'RIGHT_BACK',
        func: 'rightBackSvg'
      }, {
        name: 'LEFT_RIGHT_BACK',
        func: 'leftRightBackSvg'
      }, {
        name: 'LEFT_STRAIGHT_BACK',
        func: 'leftStraightBackSvg'
      }, {
        name: 'DELETE',
        func: 'deleteSvg'
      }]]
    }

    componentDidMount () {
      document.body.addEventListener('click', this.eventCancel)
      const { showModals } = this.props
      this.setState({
        showModals
      })
    }

    componentWillUnmount () {
      document.body.removeEventListener('click', this.eventCancel, false)
    }

    componentDidUpdate (propData) {
      const { showModals } = this.props
      if (propData.showModals !== showModals) {
        this.setState({
          showModals
        })
      }
    }

      eventCancel = (e) => {
        if (e.srcElement.getAttribute('name') !== 'editedAddDirection') {
          this.setState({
            showModals: false
          })
        } else {
          this.setState({
            showModals: true
          })
        }
      }

  straightSvg = () => (
    <svg name='editedAddDirection' width='34' height='34' id='STRAIGHT' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='STRAIGHT_PATH' fill='#333333' d='M 478.38 412.002 H 430.654 L 513.55 0 L 593.346 412.002 h -52.09 V 1024 h -62.8755 Z' />
    </svg>
  )

  leftRightStraightFunc = () => (
    <svg name='editedAddDirection' width='34' height='34' id='LEFT_STRAIGHT_RIGHT' viewBox='0 0 1024 1024'>
      <path fill='#333333' id='LEFT_STRAIGHT_RIGHT_PATH' name='editedAddDirection' d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
    </svg>
  )

  leftSvg = () => (
    <svg name='editedAddDirection' id='LEFT' viewBox='0 0 1024 1024' fill='#333333' width='34' height='34'>
      <path name='editedAddDirection' id='LEFT_PATH' d='M 450.608 0 L 373.234 290.022 l 77.3742 267.609 V 394.919 l 138.766 137.159 V 1024 H 650.766 V 376.727 L 450.608 172.118 Z' />
    </svg>
  )

  backSvg = () => (
    <svg name='editedAddDirection' id='BACK' width='34' height='34' fill='#333333' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='BACK_PATH' d='M 696.889 1024 V 125.819 C 660.414 41.9271 607.953 0 539.525 0 C 471.097 0 422.874 41.9366 394.875 125.819 v 212.158 H 327.111 l 99.5461 407.96 l 108.136 -407.96 h -69.5467 v -94.9096 c 4.95882 -62.0658 29.7244 -93.1081 74.2779 -93.1081 c 44.563 0 73.7185 31.0424 87.4667 93.1081 V 1024' />
    </svg>
  )

  rightSvg = () => (
    <svg name='editedAddDirection' id='RIGHT' width='34' height='34' fill='#333333' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='RIGHT_PATH' d='M 571.277 0 L 645.981 290.022 l -74.7041 267.609 V 394.919 l -133.981 137.159 V 1024 H 378.019 V 376.727 l 193.258 -204.609 Z' />
    </svg>
  )

  straightRightSvg = () => (
    <svg name='editedAddDirection' id='STRAIGHT_RIGHT' width='34' height='34' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='STRAIGHT_RIGHT_PATH' fill='#333333' d='M 405.36 1024 V 413.103 H 354.093 L 433.238 0 l 79.1351 413.103 h -49.5731 v 337.413 L 600.906 614.41 v -168.051 L 669.907 718.733 l -69.0004 258.699 V 823.928 L 462.81 952.09 V 1024 Z' />
    </svg>
  )

  straightLeft = () => (
    <svg name='editedAddDirection' id='LEFT_STRAIGHT' width='34' height='34' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' fill='#333333' id='LEFT_STRAIGHT_PATH' d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
    </svg>
  )

  backStraight = () => (
    <svg id='STRAIGHT_BACK' name='editedAddDirection' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='STRAIGHT_BACK_PATH' name='editedAddDirection' d='M589.302519 0L663.703704 408.187259h-48.57363V1014.518519h-58.624V684.73363l-3.982222 6.893037c-8.590222-39.973926-26.548148-60.472889-53.883259-61.496889l-2.180741-0.047408c-28.558222 0-44.439704 20.517926-47.616 61.534815v62.738963h44.581926L424.106667 1024 360.296296 754.346667h43.434667V614.115556C421.679407 558.677333 452.589037 530.962963 496.459852 530.962963c22.784 0 42.799407 7.471407 60.055704 22.423704l-0.009482-145.199408H512L589.302519 0z' />
    </svg>
  )

  backLeft = () => (
    <svg id='LEFT_BACK' name='editedAddDirection' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='LEFT_BACK_PATH' name='editedAddDirection' d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />
    </svg>
  )

  leftRightSvg = () => (
    <svg name='editedAddDirection' id='LEFT_RIGHT' width='34' height='34' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' fill='#333333' id='LEFT_RIGHT_PATH' d='M 478.505 1024 V 526.547 L 345.337 394.919 v 162.711 L 267.963 290.022 L 345.337 0 v 172.118 L 512 342.485 l 166.663 -170.367 V 0 L 756.037 290.022 l -77.3742 267.609 V 394.919 L 545.495 526.547 V 1024 h -66.9907 Z' />
    </svg>
  )

  leftStrightRogthBackSvg = () => (
    <svg name='editedAddDirection' width='34' height='34' id='LEFT_STRAIGHT_RIGHT_BACK' viewBox='0 0 1024 1024'>
      <path id='LEFT_STRAIGHT_RIGHT_BACK_PATH' name='editedAddDirection' fill='#333333' d='M518.276741 0L597.333333 408.187259h-51.607703L545.716148 546.133333l136.154074-120.272592V293.925926L758.518519 497.701926 681.860741 675.081481V557.653333L545.716148 673.943704V1014.518519h-1.34637v0.142222H483.555556V1014.518519h-0.12326v-2.740149h-3.811555V708.41837c-13.539556-19.560296-32.95763-29.345185-58.263704-29.345185-34.721185 0-50.669037 22.584889-47.853037 67.745185l0.208593 2.910815v49.464889h57.144888L348.16 1011.787852 265.481481 799.184593h57.154371V701.696c4.721778-13.293037 10.477037-24.841481 17.256296-34.645333L265.481481 494.838519l76.657778-203.776v131.925333l141.293037 124.823704V408.187259H436.148148L518.276741 0zM342.139259 554.780444v109.160297C361.035852 638.501926 387.441778 625.777778 421.357037 625.777778c1.336889 0 2.673778 0.018963 3.982222 0.06637l-83.2-71.063704z' />
    </svg>
  )

  straightRightBackSvg = () => (
    <svg name='editedAddDirection' id='STRAIGHT_RIGHT_BACK' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='STRAIGHT_RIGHT_BACK_PATH' name='editedAddDirection' fill='#333333' d='M512.176 0l77.52 413.104h-48.544v133.712l135.264-127.52V251.232L744 460.24l-67.584 209.008v-153.52l-135.264 128.16V1024h-56.272V718.032c-12.896-21.76-31.92-32.624-57.12-32.624-33.6 0-48.656 23.776-45.152 71.312v49.92h54.176l-78.4 214.608L280 806.656h54.176v-98.4c17.072-51.088 48.256-76.64 93.6-76.64 23.536 0 42.592 7.632 57.12 22.848l-0.016-241.36H434.672L512.16 0z' />
    </svg>
  )

  rightBackSvg = () => (
    <svg name='editedAddDirection' id='RIGHT_BACK' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='RIGHT_BACK_PATH' name='editedAddDirection' fill='#333333' d='M674.452645 0L751.483871 287.331097 674.452645 552.464516v-161.197419l-138.173935 135.894709v487.357936h-61.109678V688.194065c-9.529806-38.730323-28.787613-58.103742-57.806451-58.103742-29.844645 0-46.426839 20.513032-49.763097 61.539096v62.728258h46.592L341.751742 1024 275.059613 754.357677h45.402839v-140.238451c18.745806-55.444645 51.051355-83.15871 96.900129-83.15871 21.652645 0 40.910452 6.177032 57.806451 18.547613V373.248l199.283613-202.718968V0z' />
    </svg>
  )

  leftRightBackSvg = () => (
    <svg name='editedAddDirection' id='LEFT_RIGHT_BACK' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='LEFT_RIGHT_BACK_PATH' name='editedAddDirection' fill='#333333' d='M478.504673 1024V580.368748c-14.068037-25.446879-32.289495-38.165533-54.673944-38.165533-29.810841 0-44.721047 22.56628-44.721047 67.708411V806.663178h53.640374l-77.613458 214.590205L277.53271 806.653607h53.640374V574.617121a238.63028 238.63028 0 0 1 10.24-30.557308L267.962617 290.021682 345.336822 0v206.101533L512 376.468336l166.663178-170.366803V0L756.037383 290.021682l-77.374205 267.608524V360.046056L545.495327 491.653981V1024h-66.990654zM345.336822 360.046056v175.285832c17.943925-37.179813 44.118131-55.764935 78.493907-55.764935 22.307888 0 40.538916 6.316262 54.683514 18.939215L478.504673 491.663551 345.336822 360.046056z' />
    </svg>
  )

  leftStraightBackSvg = () => (
    <svg name='editedAddDirection' id='LEFT_STRAIGHT_BACK' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='LEFT_STRAIGHT_BACK_PATH' name='editedAddDirection' fill='#333333' d='M587.824 0L664 413.104h-49.344V1024H559.36V714.784c-12.608-19.584-30.656-29.376-54.128-29.376-33.04 0-47.84 23.776-44.4 71.312v49.92H514.08L437.04 1021.264 360 806.656h53.248v-98.4c16.768-51.088 47.424-76.64 91.984-76.64 22.064 0 40.112 6.944 54.128 20.8v-8.528l-132.944-128.16v153.52L360 460.24l66.416-209.008v168.064l132.944 127.52v-133.712H511.648L587.808 0z' />
    </svg>
  )

  handleOnMouseOut = (str) => {
    d3.select(`#${str}_PATH`).attr('fill', '#333333')
    this.setState({
      showText: ''
    })
  }

  handleOnMouseOver = (str) => {
    d3.select(`#${str}_PATH`).attr('fill', '#fff')
    this.setState({
      showText: str
    })
  }

  drawerDirectionModal = () => {
    let isShowDelete = false
    if (this.props.editRoadParams) {
      const deviceIndex = this.props.editRoadParams.split('_')
      isShowDelete = !deviceIndex[2]
    }
    return this.state.directionList.map((items, index) => {
      return (
        <tr key={index}>
          {
            items.map((item, i) => {
              if (isShowDelete && item.name === 'DELETE') {
                return null
              } else {
                return (
                  <td key={`${index}_${i}`}>
                    {
                      item.name !== 'DELETE' &&
                        <div
                          name='editedAddDirection'
                          className={`add-device-svg ${item.name === this.state.showText ? 'select-bg' : ''}`}
                          onMouseOver={() => {
                            this.handleOnMouseOver(item.name)
                          }}
                          onClick={() => {
                            this.props.handleSelectDirection(item.name)
                          }}
                          onMouseOut={() => {
                            this.handleOnMouseOut(item.name)
                          }}
                        >
                          {this[`${item.func}`]()}
                        </div>
                    }
                    {
                      item.name === 'DELETE' &&
                        <div
                          onMouseOver={() => {
                            this.setState({
                              showText: item.name
                            })
                          }}
                          onClick={() => {
                            this.props.handleSelectDirection(item.name)
                          }}
                          onMouseOut={() => {
                            this.setState({
                              showText: ''
                            })
                          }}
                          name='editedAddDirection'
                          className={`delete-btn ${item.name === this.state.showText ? 'select-bg' : ''}`}
                        >
                          <span name='editedAddDirection'>删除</span>
                        </div>
                    }
                  </td>
                )
              }
            })
          }
        </tr>
      )
    })
  }

  render () {
    const { modalCoordinate: { x, y } } = this.props
    return (
      <foreignObject id='cb-aspects-Directions-Modal' x={x} y={y} width={this.state.showModals ? 281 : 0} height={this.state.showModals ? 245 : 0}>
        <div name='editedAddDirection' className={`add-directions ${this.state.showModals ? '' : 'no-box'}`}>
          {
            this.state.showModals &&
              <table className='direction-tables'>
                <tbody>
                  {this.drawerDirectionModal()}
                </tbody>
              </table>
          }
        </div>
      </foreignObject>
    )
  }
}

InnerAddDirections.defaultProps = {
  handleSelectDirection: () => {},
  modalCoordinate: { x: 0, y: 0 }
}
InnerAddDirections.propTypes = {
  handleSelectDirection: PropTypes.oneOfType([PropTypes.func]),
  modalCoordinate: PropTypes.oneOfType([PropTypes.object])
}

export default InnerAddDirections
