describe('Sinoptik main page tests', () => {

    beforeEach(() => {
        cy.visit('https://ua.sinoptik.ua/');
    });

    it('should search for Kyiv and check response 200', () => {
        
        cy.interceptPayLoadwithMethodAndPath('POST', '**/weather/location/forecast/by_id', 'kyivPage');

        cy.get('input[aria-label="Пошук населенного пункта"]')
            .type('Київ');

        cy.get('.PR03qI4Z').contains('Київ').should('be.visible').click();

        cy.url().should('include', '/pohoda/kyiv');

        cy.waitAndLogPayLoad('@kyivPage', 200);
    });
    
});

describe('Sinoptik Kyiv 7 and 10 days tabs tests', () => {
    const daysOfWeek = ['понеділок', 'вівторок', 'середа', 'четвер', 'пʼятниця', 'субота', 'неділя'];
    const ukMonthsGenitive = [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];

    const today = new Date();

    const getExpectedDayMonthWeekday = (offset) => {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        return {
            dayNumber: date.getDate(),
            monthName: ukMonthsGenitive[date.getMonth()],
            weekDay: daysOfWeek[(date.getDay() + 6) % 7]
        };
    };

    /**
     * Function for checking day tabs
     * @param {number} numberOfDays - number of day tabs to check (7 or 10)
     */
    function checkTabs(numberOfDays) {
        for (let i = 0; i < numberOfDays; i++) {
            ((index) => {                
                const { dayNumber, monthName, weekDay } = getExpectedDayMonthWeekday(index);
                
                cy.get('div.DMP0kolW a.tkK415TH').eq(index).then($tab => {
                    if (index !== 0) {
                        cy.wrap($tab).click();   
                    } else {
                        cy.wrap($tab).should('have.class', 'OGO-yOID');
                    }

                    cy.wrap($tab).find('p.RSWdP9mW').should('contain.text', dayNumber.toString());

                    cy.wrap($tab).find('p.yQxWb1P4').should('contain.text', monthName);

                    cy.wrap($tab).find('p.xM6dxfW4').should('contain.text', weekDay);
                });
            })(i);
        }
    }

    beforeEach(() => {
        cy.visit('https://ua.sinoptik.ua/pohoda/kyiv');
    });

    it('should switch through 7 day tabs and verify dates and tab contents', () => {
        checkTabs(7);
    });

    it('should switch to 10 days view and verify dates and tab contents for 10 days', () => {

        cy.interceptPayLoadwithMethodAndPath('GET', '**/stats/visit/pohoda/kyiv/**', 'kiev10days');
        
        cy.get('a[href*="/10-dniv"]').click();

        cy.waitAndLogPayLoad('@kiev10days', 200);
              
        checkTabs(10);
    });
});
