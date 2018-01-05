import React from 'react';

export default class messageItem extends React.Component {
    render () {
      return (
           <li className={this.props.user? "message right appeared": "message left appeared"}>
               <div className="avatar"></div>
               <div className="text_wrapper">
                   <div className="text"><b>{this.props.message.userName}</b><br></br>{this.props.message.message}</div>
               </div>
           </li>
       )
    }
}
