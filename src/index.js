import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';

import { isArrayEmpty, compareArraySize, conditionalPropType } from '../src/utils/common.utils';

 
const propTypes = {
    items: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number,
    prevText: PropTypes.string,
    firstText: PropTypes.string,
    nextText: PropTypes.string,
    lastText: PropTypes.string,
    paginatorClass: PropTypes.string,
    disabledClass: PropTypes.string,
    activeClass: PropTypes.string,
    fontSize: PropTypes.string,
    useNavIcon: PropTypes.bool,
    iconFirst: conditionalPropType(props => (props.useNavIcon && !props.iconFirst), "'iconFirst' must be string if 'useIcon' is true"),
    iconPrev: conditionalPropType(props => (props.useNavIcon && !props.iconPrev), "'iconPrev' must be string if 'useIcon' is true"),
    iconNext: conditionalPropType(props => (props.useNavIcon && !props.iconNext), "'iconNext must be string if 'useIcon' is true"),
    iconLast: conditionalPropType(props => (props.useNavIcon && !props.iconLast), "'iconLast must be string if 'useIcon' is true"),
  }
 
const defaultProps = {
    initialPage: 1,
    pageSize: 10
}

/**
 * Simple Paginator Component for react app
 */
 
class Paginator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }
 
    componentDidMount() {
        // set page if items array isn't empty
        const {items, initialPage} = this.props
        if (isArrayEmpty(items)) {
            this.setPage(initialPage);
        }
    }
 
    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (compareArraySize(this.props.items, prevProps.items)) {
            this.setPage(this.props.initialPage);
        }
    }

    /**
     * Updates the current page
     * @param {number} page page number to set as the active page
     */
    setPage(page) {
        const { items, pageSize } = this.props;
        let { pager } = this.state;
 
        if (page < 1 || page > pager.totalPages) {
            return;
        }
 
        // get new pager object for specified page
        pager = this.getPager(items.length, page, pageSize);
 
        // get new page of items from items array
        const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
 
        // update state
        this.setState(() => { 
            return { pager: pager }
        });
        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }
    
    /**
     * Determines how pager button are displayed on page
     * @param {number} totalItems number of items in the array
     * @param {number} currentPage current active page
     * @param {number} pageSize number of items to display per page
     */
    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
 
        // default page size is 10
        pageSize = pageSize || 10;
 
        // calculate total pages
        const totalPages = Math.ceil(totalItems / pageSize);
 
        let startPage, endPage;
        const maxButtonPerPage = 6;
        const maxButtonsByHalf = 3;
        const incrementByFour = 3;
        const decrementByFive = 3; 
        const subNineFromTotalPages = 9;
        if (totalPages <= maxButtonPerPage) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= maxButtonsByHalf) {
                startPage = 1;
                endPage = maxButtonPerPage;
            } else if (currentPage + incrementByFour >= totalPages) {
                startPage = totalPages - subNineFromTotalPages;
                endPage = totalPages;
            } else {
                startPage = currentPage - decrementByFive;
                endPage = currentPage + incrementByFour ;
            }
        }
 
        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
        const pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
 
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    /**
     * Determines the upper and lower limit of the pager
     * @param {array} arr array of objects
     */
    getMinMax(arr) {
        const min = Math.min.apply(null,arr);
        const max = Math.max.apply(null,arr);
        return {"min": min, "max": max};
    }
 
    render() {
        const { pager } = this.state;
        const { disabledClass, activeClass, paginatorClass, 
                firstText, nextText, lastText, prevText } = this.props;
 
        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }
 
        return (
            <ul className={ paginatorClass ? `${paginatorClass}`: `${style.pagination}` }>
                <li>
                    <a onClick={() => this.setPage(1)} 
                      className={pager.currentPage === 1 ? `${style.disabledA}`  : ''}
                    >
                      { firstText ?  `${firstText}`  : 'First' } 
                    </a>
                </li>
                <li>
                    <a onClick={() => this.setPage(pager.currentPage - 1)}
                      className={pager.currentPage === 1 ? `${style.disabledA}`  : ''}
                    >
                       { prevText ?  `${prevText}`  : 'Previous' }
                    </a>
                </li>
                { this.getMinMax(pager.pages).min > 1 && (
                    <li><a className="elli">...</a></li>
                )}
                {pager.pages.map((page, index) =>
                    <li key={index}  className={pager.currentPage === page ? `${style.activeLi}`  : ''} >
                        <a onClick={() => this.setPage(page)}
                         className={pager.currentPage === page ? `${style.activeA}` : ''}
                        >{page}</a>
                    </li>
                )}
      
                { this.getMinMax(pager.pages).max < pager.totalPages - 1 && (
                    <span>
                    <li><a className="elli">...</a></li>
                    <li>
                        <a onClick={() => this.setPage(pager.totalPages)}
                          className={pager.currentPage === pager.totalPages ? `${style.disabledA}`  : ''}
                        >{pager.totalPages}</a>
                    </li>
                    </span>
                )}
                <li>
                    <a onClick={() => this.setPage(pager.currentPage + 1)}
                      className={pager.currentPage === pager.totalPages ? `${style.disabledA}`  : ''}
                    >
                      { nextText ?  `${nextText}`  : 'Next' }
                    </a>
                </li>
                <li>
                    <a onClick={() => this.setPage(pager.totalPages)}
                      className={pager.currentPage === pager.totalPages ? `${style.disabledA}`  : ''}
                    >    
                      { lastText ?  `${lastText}`  : 'Last' }
                    </a>
                </li>
            </ul>
        );
    }
}
 
Paginator.propTypes = propTypes;
Paginator.defaultProps = defaultProps;
export default Paginator;