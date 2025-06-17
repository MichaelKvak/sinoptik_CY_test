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
    const jsDay = today.getDay();
    const normalizedTodayIndex = jsDay === 0 ? 6 : jsDay - 1;

    const getExpectedDayMonth = (offset) => {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        return {
            dayNumber: date.getDate(),
            monthName: ukMonthsGenitive[date.getMonth()]
        };
    };

    /**
     * Function for checking day tabs
     * @param {number} numberOfDays - day numbers (7 or 10)
     */
    function checkTabs(numberOfDays) {
        for (let i = 0; i < numberOfDays; i++) {
            ((index) => {                
                const { dayNumber, monthName } = getExpectedDayMonth(index);
                
                // cy.interceptPayLoadwithMethodAndPath('GET', '**/pohoda/kyiv/**', 'visitStats');

                cy.get('div.DMP0kolW a.tkK415TH').eq(index).then($tab => {
                    if (index !== 0) {
                        cy.wrap($tab).click();   

                        // cy.waitAndLogPayLoad('@visitStats', 200);

                    } else {
                        cy.wrap($tab).should('have.class', 'OGO-yOID');
                    }

                    cy.wrap($tab).find('p.RSWdP9mW').should('contain.text', dayNumber.toString());
                    cy.wrap($tab).find('p.yQxWb1P4').should('contain.text', monthName);
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
        
        cy.get('.RVVQqULN a.gjE2wrfZ').click();

        cy.waitAndLogPayLoad('@kiev10days', 200);
              
        checkTabs(10);
    });
});
