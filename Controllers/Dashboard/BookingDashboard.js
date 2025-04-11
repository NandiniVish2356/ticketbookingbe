const { request, response } = require('express');
const db = require('../../db');

const getbookingdetail = (req, res) => {
    let query = `select * from bookingdetail`
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            res.send({ data });
        }
    })
}

const bookseats = (req, res) => {
    const { nseat, uid } = req.body;

    let query = `
      SELECT sid 
      FROM bookingdetail 
      WHERE isBooked = false 
      ORDER BY sid ASC
    `;

    db.query(query, (err, data) => {
        if (err) return res.status(500).send(err);

        const seatsByRow = {};
        const rowSize = 7;

        // Step 1: Group seats by rows
        data.forEach(row => {
            const seatId = row.sid;
            const rowNum = Math.ceil(seatId / rowSize);
            if (!seatsByRow[rowNum]) seatsByRow[rowNum] = [];
            seatsByRow[rowNum].push(seatId);
        });

        let selectedSeats = [];

        // Step 2: Check for consecutive seats in current or next row
        const findConsecutiveSeats = (seats, n) => {
            for (let i = 0; i <= seats.length - n; i++) {
                let consecutive = true;
                for (let j = 1; j < n; j++) {
                    if (seats[i + j] !== seats[i] + j) {
                        consecutive = false;
                        break;
                    }
                }
                if (consecutive) return seats.slice(i, i + n);
            }
            return [];
        };

        const sortedRowNums = Object.keys(seatsByRow).sort((a, b) => a - b);

        for (let i = 0; i < sortedRowNums.length; i++) {
            const rowSeats = seatsByRow[sortedRowNums[i]];
            selectedSeats = findConsecutiveSeats(rowSeats, nseat);
            if (selectedSeats.length > 0) break;

            // Try next row if exists
            if (i + 1 < sortedRowNums.length) {
                const nextRowSeats = seatsByRow[sortedRowNums[i + 1]];
                selectedSeats = findConsecutiveSeats(nextRowSeats, nseat);
                if (selectedSeats.length > 0) break;
            }
        }

        // Step 3: Fallback to any available seats
        if (selectedSeats.length === 0 && data.length >= nseat) {
            selectedSeats = data.slice(0, nseat).map(seat => seat.sid);
        }

        if (selectedSeats.length < nseat) {
            return res.status(400).send({ message: 'Not enough seats available' });
        }

        // Step 4: Update seats
        const updateQuery = `
        UPDATE bookingdetail 
        SET isBooked = 1, bookedBy = ${uid}
        WHERE sid IN (${selectedSeats.join(',')})
      `;

        db.query(updateQuery, (err) => {
            if (err) return res.status(500).send(err);
            res.send({ message: 'Seats booked successfully', seats: selectedSeats });
        });
    });
};
const resetbookingdetail = (req,res) =>{
    let query = `UPDATE bookingdetail SET isBooked = false,bookedBy=null`;
    db.query(query, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data) {
            res.send({ msg:"Updated Successfully"});
        }
    })
}

module.exports = { getbookingdetail, bookseats ,resetbookingdetail}