import React from 'react';
import PropTypes from 'prop-types';

import { isArrayEmpty, compareArraySize } from '../src/utils/common.utils';
 
const propTypes = {
    items: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number
}
 
const defaultProps = {
    initialPage: 1,
    pageSize: 10
}
 
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
    getMinMax(arr) {
        let min = arr[0], max = arr[0];  
        for (let i = 1, len=arr.length; i < len; i++) {
          let v = arr[i];
          min = (v < min) ? v : min;
          max = (v > max) ? v : max;
        }
      
        return {"min": min, "max": max};
    }
 
    render() {
        const { pager } = this.state;
 
        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }
 
        return (
            <ul className="pagination">
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(1)}>First</a>
                </li>
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
                </li>
                { this.getMinMax(pager.pages).min > 1 && (
                    <li><a className="elli">...</a></li>
                )}
                {pager.pages.map((page, index) =>
                    <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                        <a onClick={() => this.setPage(page)}>{page}</a>
                    </li>
                )}
                
                { this.getMinMax(pager.pages).max < pager.totalPages - 1 && (
                    <span>
                    <li><a className="elli">...</a></li>
                    <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                        <a onClick={() => this.setPage(pager.totalPages)}>{pager.totalPages}</a>
                    </li>
                    </span>
                )}
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
                </li>
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
                </li>
            </ul>
        );
    }
}
 
Paginator.propTypes = propTypes;
Paginator.defaultProps = defaultProps;
export default Paginator;