import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../common';
import { FaCalculator } from 'react-icons/fa';
import numeral from 'numeral';
import './MortgageCalculator.css';

/**
 * MortgageCalculator Component
 * Interactive mortgage payment calculator
 */
const MortgageCalculator = ({ propertyPrice = 0 }) => {
    const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 80% loan
    const [downPayment, setDownPayment] = useState(propertyPrice * 0.2); // 20% down
    const [interestRate, setInterestRate] = useState(2.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // Calculate monthly payment
    const calculateMonthlyPayment = () => {
        const principal = parseFloat(loanAmount) || 0;
        const monthlyRate = (parseFloat(interestRate) / 100) / 12;
        const numberOfPayments = parseFloat(loanTerm) * 12;

        if (monthlyRate === 0) {
            return principal / numberOfPayments;
        }

        const monthlyPayment =
            principal *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        return monthlyPayment;
    };

    const monthlyPayment = calculateMonthlyPayment();
    const totalPayment = monthlyPayment * loanTerm * 12;
    const totalInterest = totalPayment - loanAmount;

    return (
        <div className="mortgage-calculator">
            <div className="calculator-header">
                <FaCalculator />
                <h3>Mortgage Calculator</h3>
            </div>

            <div className="calculator-inputs">
                <div className="calculator-input-group">
                    <label>Property Price</label>
                    <Input
                        type="number"
                        value={propertyPrice}
                        readOnly
                        fullWidth
                    />
                </div>

                <div className="calculator-input-group">
                    <label>Down Payment (€)</label>
                    <Input
                        type="number"
                        value={downPayment}
                        onChange={(e) => {
                            setDownPayment(parseFloat(e.target.value) || 0);
                            setLoanAmount(propertyPrice - (parseFloat(e.target.value) || 0));
                        }}
                        fullWidth
                    />
                    <span className="input-hint">
                        {((downPayment / propertyPrice) * 100).toFixed(0)}% of price
                    </span>
                </div>

                <div className="calculator-input-group">
                    <label>Loan Amount (€)</label>
                    <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => {
                            setLoanAmount(parseFloat(e.target.value) || 0);
                            setDownPayment(propertyPrice - (parseFloat(e.target.value) || 0));
                        }}
                        fullWidth
                    />
                </div>

                <div className="calculator-input-group">
                    <label>Interest Rate (%)</label>
                    <Input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        fullWidth
                    />
                </div>

                <div className="calculator-input-group">
                    <label>Loan Term (years)</label>
                    <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                        fullWidth
                    />
                </div>
            </div>

            <div className="calculator-results">
                <div className="result-card result-primary">
                    <span className="result-label">Monthly Payment</span>
                    <span className="result-value">
                        {numeral(monthlyPayment).format('€0,0.00')}
                    </span>
                </div>

                <div className="result-card">
                    <span className="result-label">Total Payment</span>
                    <span className="result-value">
                        {numeral(totalPayment).format('€0,0')}
                    </span>
                </div>

                <div className="result-card">
                    <span className="result-label">Total Interest</span>
                    <span className="result-value">
                        {numeral(totalInterest).format('€0,0')}
                    </span>
                </div>
            </div>

            <div className="calculator-note">
                <small>
                    * This is an estimate. Actual monthly payment may vary based on additional
                    costs like insurance, taxes, and fees.
                </small>
            </div>
        </div>
    );
};

MortgageCalculator.propTypes = {
    propertyPrice: PropTypes.number,
};

export default MortgageCalculator;
