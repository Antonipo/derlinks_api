import { connectToBD } from "../db.js";

function combineResults(result1, result2) {
  const combinedResult = [];
  for (const group of result1) {group
    const groupWhitLinks = {
      group_id: group.group_id,
      group_name: group.group_name,
      links: [],
    };

    const linksGrupo = result2.filter(
      (link) => link.group_id === group.group_id
    );
    groupWhitLinks.links=linksGrupo
    
    combinedResult.push(groupWhitLinks);
  }
  return combinedResult;
}

export const getLinks = async (req,res) => {
    try {
        const client = await connectToBD();
        const group_id = req.params.id;
        const consultLinks = 'SELECT link_id,name,url,group_id FROM link WHERE group_id = $1';
        const values=[group_id]
        const resultLinks = await client.query(consultLinks,values);
        client.release();
        res.send(resultLinks.rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const createLink = async (req,res) => {
    try {
        const client = await connectToBD();
        const {name,url,group_id}= req.body;
        const consultInsert = 'INSERT INTO link(name,url,group_id) VALUES ($1,$2,$3) RETURNING link_id,name,url,group_id';
        const values = [name,url,group_id]
        const newLink = await client.query(consultInsert,values);
        client.release();
        res.json(newLink.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const getLink = async (req,res) => {
    try {
        const client = await connectToBD();
        const link_id = req.params.id;
        const consultLink = 'SELECT link_id,name,url,group_id FROM link WHERE link_id = $1';
        const values=[link_id]
        const resultLink = await client.query(consultLink,values);
        client.release();
        res.send(resultLink.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const updateLink = async (req,res) => {
    try {
        const client = await connectToBD();
        const link_id = req.params.id;
        const {name,url,group_id} = req.body
        const updateLink = 'UPDATE link SET name=$1,url=$2,group_id=$3 WHERE link_id=$4' ;
        const values=[name,url,group_id,link_id]
        const resultLink = await client.query(updateLink,values);
        client.release();
        res.send(resultLink.rows[0]);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const deleteLink = async (req,res) => {
    try {
        const client = await connectToBD();
        const link_id = req.params.id;
        const deleteLink = 'DELETE FROM link WHERE link_id = $1' ;
        const values=[link_id]
        const resultLink = await client.query(deleteLink,values);
        client.release();
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getGroups = async (req,res) => {
    try {
        const client = await connectToBD();
        const user_id = req.user.user_id;
        const consultGroups = 'SELECT group_id,group_name FROM group_link WHERE user_id = $1';
        const values=[user_id]
        const resultGroups = await client.query(consultGroups,values);
        const consulLinks='SELECT l.link_id,l.name,l.url,g.group_id FROM link l inner join group_link g on l.group_id=g.group_id where user_id=$1';
        const resultLinks = await client.query(consulLinks,values);
        client.release();
        const result =combineResults(resultGroups.rows,resultLinks.rows)
        res.send(result)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const getGroup = async (req,res) => {
    try {
        const client = await connectToBD();
        const group_id = req.params.id
        const consultGroup = 'SELECT group_id,group_name FROM group_link WHERE group_id = $1';
        const values=[group_id]
        const resultGroup = await client.query(consultGroup,values);
        client.release();
        res.send(resultGroup.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const createGroup = async (req,res) => {
    try {
        const client = await connectToBD();
        const {group_name}= req.body;
        const user_id = req.user.user_id;
        const groupInsert = 'INSERT INTO group_link(group_name,user_id) VALUES ($1,$2) RETURNING group_id,group_name,user_id';
        const values = [group_name,user_id]
        const newGroup = await client.query(groupInsert,values);
        client.release();
        res.json(newGroup.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const deleteGroup = async (req,res) => {
    try {
        const client = await connectToBD();
        const group_id = req.params.id;
        const deleteLink = 'DELETE FROM group_link WHERE group_id = $1' ;
        const values=[group_id]
        const resultGroup = await client.query(deleteLink,values);
        client.release();
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const updateGroup = async (req,res) => {
    try {
        const client = await connectToBD();
        const group_id = req.params.id;
        const {group_name} = req.body
        const updateGroup = 'UPDATE group_link SET group_name=$1 WHERE group_id=$2 RETURNING group_id,group_name,user_id' ;
        const values=[group_name,group_id]
        const resultLink = await client.query(updateGroup,values);
        client.release();
        res.send(resultLink.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}